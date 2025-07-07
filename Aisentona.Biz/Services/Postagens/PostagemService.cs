using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using Aisentona.Entities.ViewModels;
using Aisentona.Enumeradores;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Aisentona.Biz.Services.Postagens
{
    public class PostagemService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PostagemService> _logger;

        public PostagemService(ApplicationDbContext postagemContext, ILogger<PostagemService> logger)
        {
            _context = postagemContext;
            _logger = logger;
        }
        public List<PostagemRequest> ListarUltimasPostagens()
        {
            // Busca as últimas 4 postagens ativas, ordenadas pela data de criação

            List<Postagem> ultimasPostagens = _context.CF_Postagem
                .Include(p => p.Categoria) // Inclui a relação com a Categoria
                .Include(p => p.Status)
                .Where(p => p.Fl_Ativo == true && p.Fl_Premium == false) // Filtra apenas as postagens ativas
                .OrderByDescending(p => p.DT_Criacao) // Ordena pela data de criação (mais recentes primeiro)
                .Take(3) // Limita a 4 postagens
                .ToList();

            // Mapeia as postagens para PostagemDTO
            return MapearParaDTO(ultimasPostagens);
        }

        public List<PostagemRequest> ListarUltimasPostagensPremium()
        {

            // Busca as últimas 3 postagens ativas, premium e publicadas
            List<Postagem> ultimasPostagens = _context.CF_Postagem
                .Include(p => p.Categoria) 
                .Where(p => p.Fl_Ativo == true && p.Fl_Premium == true && p.Id_Status == 2) // Status 2 = Publicado
                .OrderByDescending(p => p.DT_Criacao)
                .Take(3)
                .ToList();

            // Mapeia as postagens para PostagemDTO
            return MapearParaDTO(ultimasPostagens);
        }

        public List<PostagemRequest> ListarPostagensPaginadas(int pagina, int quantidadePorPagina)
        {
            var postagens = _context.CF_Postagem
                .Include(p => p.Categoria)
                .Include(p => p.Status)
                .Where(p => p.Fl_Ativo == true || p.Id_Status == 5)
                .OrderByDescending(p => p.DT_Criacao)
                .Skip((pagina - 1) * quantidadePorPagina) // Pula os registros das páginas anteriores
                .Take(quantidadePorPagina) // Pega apenas a quantidade necessária
                .ToList();

            return MapearParaDTO(postagens);
        }

        public int ContarTotalDePostagens()
        {
            return _context.CF_Postagem.Count(p => p.Fl_Ativo == true);
        }


        public List<PostagemRequest> ListarPostagensComFiltro(PostagemResponse postagemResponse)
        {
            // Usando AsNoTracking para consultas de leitura
            var query = _context.CF_Postagem
                .AsNoTracking()  // Não rastrear as entidades para melhorar a performance
                .Include(p => p.Categoria)
                .Include(p => p.Status)
                .OrderByDescending(p => p.DT_Criacao)
                .Where(p => p.Fl_Ativo == true);

            // Filtro por Título
            if (!string.IsNullOrEmpty(postagemResponse.Titulo))
            {
                query = query.Where(p => p.Titulo.Contains(postagemResponse.Titulo));
            }

            // Filtro por Status
            if (postagemResponse.IdStatus != 0)
            {
                query = query.Where(p => p.Status.Id_Status == postagemResponse.IdStatus);
            }

            // Filtro por Editoria
            if (postagemResponse.IdCategoria != 0)
            {
                query = query.Where(p => p.Id_Categoria == postagemResponse.IdCategoria);
            }

            // Filtro por Tipo de Publicação (Premium/Comum)
            if (postagemResponse.PremiumOuComum.Contains("Publicação Comum"))
            {
                query = query.Where(p => p.Fl_Premium == false);
            }

            if (postagemResponse.PremiumOuComum.Contains("Publicação Premium"))
            {
                query = query.Where(p => p.Fl_Premium == true);
            }


            // Filtro por Data de Publicação (Período)
            if (postagemResponse?.DataCriacao != null)
            {
                query = query.Where(p => p.DT_Criacao >= postagemResponse.DataCriacao);
            }

            // Ordena as postagens pela data de criação (mais recentes primeiro)
            query = query.OrderByDescending(p => p.DT_Criacao);

            // Mapeia as postagens para PostagemDTO
            var postagens = query.ToList();
            return MapearParaDTO(postagens);
        }

        public PostagemRequest CarregarPostagemPorId(int id)
        {
            // Busca a postagem diretamente no banco de dados
            Postagem? postagem = _context.CF_Postagem.Include(x => x.PostagemAlerta).FirstOrDefault(c => c.Id_Postagem == id && c.Fl_Ativo);

            if (postagem == null)
            {
                throw new Exception("Postagem não encontrada ou inativa."); // Lida com casos em que a postagem não existe
            }

            // Lista as editorias disponíveis
            List<EditoriaDTO> editoriaDTO = ListarEditorias();

            // Localiza a categoria correspondente
            EditoriaDTO categoria = editoriaDTO.FirstOrDefault(c => c.Id == postagem.Id_Categoria);

            // Realiza a conversão dos alertas para o tipo `AlertaResponse`
            List<AlertaResponse> alertasResponse = postagem.PostagemAlerta
                .Select(alerta => new AlertaResponse
                {
                    NumeroAlerta = alerta.Numero_Alerta,
                    Mensagem = alerta.Mensagem
                })
                .ToList();

            // Retorna o objeto PostagemRequest montado diretamente
            return new PostagemRequest
            {
                IdCategoria = postagem.Id_Categoria,
                IdStatus = postagem.Id_Status,
                IdUsuario = postagem.Id_Usuario,
                Titulo = postagem.Titulo,
                Conteudo = postagem.Conteudo,
                Descricao = postagem.Descricao,
                Imagem = postagem.Imagem_base64,
                TextoAlteradoPorIA = postagem.Texto_alterado_por_ia,
                PalavrasRetiradasPorIA = postagem.Palavras_retiradas_por_ia,
                DataCriacao = postagem.DT_Criacao,
                NomeCategoria = categoria?.Nome ?? "Categoria não encontrada",
                Alertas = alertasResponse // Adiciona os alertas convertidos para AlertaResponse
            };
        }



        public List<EditoriaDTO> ListarEditorias()
        {
            List<Categoria> listaDeEditoriasDB = _context.CF_Postagem_Categoria
                .Where(c => c.Id_Categoria != null)
                .ToList();

            List<EditoriaDTO> listaEditorias = listaDeEditoriasDB
                .Select(c => new EditoriaDTO
                {
                    Id = c.Id_Categoria, 
                    Nome = c.Nome 
                })
                .ToList();

            return listaEditorias; 
        }



        public List<StatusDTO> ListarStatus()
        {
            List<Status> listaStatusDB = _context.CF_Postagem_Status
                .Where(c => c.Id_Status != null)
                .ToList();

            List<StatusDTO> listaStatus = listaStatusDB
                .Select(c => new StatusDTO
                {
                    Id = c.Id_Status,
                    Descricao = c.Descricao
                })
                .ToList();

            return listaStatus;

        }

        public Postagem CriarPostagem(PostagemResponse postagemResponse)
        {
            var postagemConvertida = ConverterPostagem(postagemResponse);
            var novaPostagem = postagemConvertida;

            var nomeUsuario = _context.CF_Colaborador.FirstOrDefault(x => x.Id_Usuario == postagemResponse.IdUsuario);

            novaPostagem.Fl_Ativo = true;
            novaPostagem.DT_Criacao = DateTime.Now;
            novaPostagem.Ds_UltimaAlteracao = nomeUsuario.Nm_Nome;
            novaPostagem.DT_UltimaAlteracao = null;
            novaPostagem.Id_Usuario = postagemResponse.IdUsuario;
            novaPostagem.Fl_Premium = bool.Parse(postagemResponse.PremiumOuComum);


            // --- Início da Lógica de Agendamento ---
            if (postagemResponse.IdStatus == 5) // Se o status for "Planejado"
            {
                // Chama o método auxiliar para planejar a publicação
                PlanejarPublicacao(novaPostagem, postagemResponse.DataPublicacaoAgendada);
            }
            else // Se não for planejado, a publicação é imediata (ou segue outro fluxo)
            {
                novaPostagem.Id_Status = postagemResponse.IdStatus; 
                novaPostagem.DT_PublicacaoAgendada = null;

            }
            // --- Fim da Lógica de Agendamento ---

            _context.CF_Postagem.Add(novaPostagem);
            _context.SaveChanges();

            if (postagemResponse.Alertas?.Any() == true)
            {
                foreach (var alerta in postagemResponse.Alertas)
                {
                    var novoAlerta = new PostagemAlerta
                    {
                        Id_Postagem = novaPostagem.Id_Postagem,
                        Numero_Alerta = alerta.NumeroAlerta,
                        Mensagem = alerta.Mensagem
                    };
                    _context.CF_PostagemAlertas.Add(novoAlerta);
                }
                _context.SaveChanges();
            }

            return novaPostagem;
        }

        /// <summary>
        /// Método auxiliar para planejar uma publicação.
        /// Define o status da postagem como 'Planejado' (5) e a data de agendamento.
        /// </summary>
        /// <param name="postagem">A entidade Postagem a ser planejada.</param>
        /// <param name="dataAgendamento">A data e hora para a publicação (assumindo que já vem no fuso horário local desejado).</param>
        private void PlanejarPublicacao(Postagem postagem, DateTime? dataAgendamento)
        {
            postagem.Id_Status = 5;

            if (dataAgendamento.HasValue)
            {
                // **ATRIBUIR DIRETAMENTE** - Assumimos que dataAgendamento já está no fuso horário local correto
                postagem.DT_PublicacaoAgendada = dataAgendamento.Value;

                // Validação: A data agendada deve ser no futuro em relação ao horário local atual
                if (postagem.DT_PublicacaoAgendada <= DateTime.Now) // Comparando com DateTime.Now (local)
                {
                    _logger.LogWarning($"Data de publicação agendada ({dataAgendamento.Value}) não é futura. Ajustando para null ou tratando como erro.");
                    postagem.DT_PublicacaoAgendada = null;
                }
            }
            else
            {
                postagem.DT_PublicacaoAgendada = null;
            }

            postagem.Fl_Ativo = false;
        }

        public Postagem EditarPostagem(PostagemResponse postagemResponse)
        {
            // 1. Encontra a postagem existente no banco de dados.
            // Buscamos a postagem pelo seu ID para garantir que estamos editando a entrada correta.
            Postagem postagem = _context.CF_Postagem.FirstOrDefault(x => x.Id_Postagem == postagemResponse.IdPostagem);

            // Se a postagem não for encontrada, lançamos uma exceção.
            if (postagem is null)
            {
                throw new UnauthorizedAccessException("Postagem não encontrada");
            }

            // 2. Obtém os dados do usuário que está realizando a edição.
            // É crucial saber quem está fazendo a alteração para fins de auditoria e permissões.
            var usuario = _context.CF_Colaborador.FirstOrDefault(u => u.Id_Usuario == postagemResponse.IdUsuario);

            // Lança uma exceção se o usuário não for encontrado no sistema.
            if (usuario == null)
            {
                throw new ApplicationException("Usuário não encontrado.");
            }

            // 3. Verifica as permissões do usuário para editar postagens.
            // Garante que apenas usuários autorizados possam modificar o conteúdo.
            Autorizacao tipoUsuario = (Autorizacao)usuario.Id_TipoUsuario;
            List<string> permissions = tipoUsuario.GetPermissions();

            // Se o usuário não tiver permissão específica para editar posts simples ou premium, lançamos uma exceção.
            if (!permissions.Contains("EditarPostsSimples") && !permissions.Contains("EditarPostsPremium"))
            {
                throw new UnauthorizedAccessException("Usuário não possui permissão para editar postagens.");
            }

            // 4. Atualiza os campos da postagem com os novos dados da requisição.
            // Atualizamos o status premium/comum da postagem.
            postagem.Fl_Premium = bool.Parse(postagemResponse.PremiumOuComum);

            // Atualiza os campos de conteúdo principal da postagem.
            postagem.Titulo = postagemResponse.Titulo;
            postagem.Descricao = postagemResponse.Descricao;
            postagem.Conteudo = postagemResponse.Conteudo;
            postagem.Texto_alterado_por_ia = postagemResponse.TextoAlteradoPorIA;
            postagem.Palavras_retiradas_por_ia = postagemResponse.PalavrasRetiradasPorIA;
            postagem.Imagem_base64 = postagemResponse.Imagem;
            postagem.Id_Categoria = postagemResponse.IdCategoria;
            postagem.Id_Status = postagemResponse.IdStatus; // Permite que o status da postagem seja alterado.

            // Registra a data e o nome do usuário da última alteração.
            postagem.DT_UltimaAlteracao = DateTime.Now;
            postagem.Ds_UltimaAlteracao = usuario.Nm_Nome;

            // 5. Lógica de Agendamento: ajusta a data de publicação agendada.
            // Se o status da postagem for definido como "Planejado" (ID 5), a data de agendamento é atualizada.
            if (postagemResponse.IdStatus == 5)
            {
                postagem.DT_PublicacaoAgendada = postagemResponse.DataPublicacaoAgendada;
            }
            else // Para outros status, removemos qualquer agendamento existente.
            {
                postagem.DT_PublicacaoAgendada = null;
            }

            // 6. Sincroniza os alertas da postagem.
            // Esta é a lógica principal para lidar com adição, remoção e atualização de alertas.

            // Primeiro, obtemos todos os alertas atualmente associados a esta postagem no banco de dados.
            var alertasAtuais = _context.CF_PostagemAlertas
                                        .Where(a => a.Id_Postagem == postagem.Id_Postagem)
                                        .ToList();

            // Preparamos listas para categorizar as operações que precisamos fazer no banco de dados.
            var alertasParaRemover = new List<PostagemAlerta>();
            var alertasParaAdicionar = new List<PostagemAlerta>();
            var alertasParaAtualizar = new List<PostagemAlerta>();

            // Itera sobre os alertas que JÁ EXISTEM no banco de dados.
            foreach (var alertaAtual in alertasAtuais)
            {
                // Tenta encontrar uma correspondência para o alerta atual na lista de alertas recebida na requisição (`postagemResponse`).
                // A correspondência é feita pelo 'Numero_Alerta', que atua como um identificador único dentro da postagem.
                var alertaNaResponse = postagemResponse.Alertas?
                                        .FirstOrDefault(ar => ar.NumeroAlerta == alertaAtual.Numero_Alerta);

                if (alertaNaResponse == null)
                {
                    // Se não encontramos um alerta na requisição com o mesmo 'Numero_Alerta',
                    // significa que este alerta foi removido na edição e deve ser removido do banco.
                    alertasParaRemover.Add(alertaAtual);
                }
                else
                {
                    // Se encontramos uma correspondência, verificamos se a mensagem do alerta foi alterada.
                    if (alertaAtual.Mensagem != alertaNaResponse.Mensagem)
                    {
                        // Se a mensagem for diferente, atualizamos a mensagem do alerta existente.
                        alertaAtual.Mensagem = alertaNaResponse.Mensagem;
                        // E o adicionamos à lista de alertas que precisam ser atualizados no banco.
                        alertasParaAtualizar.Add(alertaAtual);
                    }
                }
            }

            // Itera sobre os alertas que foram recebidos na requisição.
            if (postagemResponse.Alertas?.Any() == true)
            {
                foreach (var alertaNaResponse in postagemResponse.Alertas)
                {
                    // Verificamos se este alerta (identificado pelo 'Numero_Alerta') já existe no banco de dados.
                    var alertaExistente = alertasAtuais
                                        .FirstOrDefault(aa => aa.Numero_Alerta == alertaNaResponse.NumeroAlerta);

                    if (alertaExistente == null)
                    {
                        // Se o alerta não existe no banco de dados, significa que é um novo alerta e deve ser adicionado.
                        alertasParaAdicionar.Add(new PostagemAlerta
                        {
                            Id_Postagem = postagem.Id_Postagem, // Associa o novo alerta à postagem sendo editada.
                            Numero_Alerta = alertaNaResponse.NumeroAlerta,
                            Mensagem = alertaNaResponse.Mensagem
                        });
                    }
                }
            }

            // 7. Executa as operações de CRUD para os alertas no banco de dados.
            if (alertasParaRemover.Any())
            {
                _context.CF_PostagemAlertas.RemoveRange(alertasParaRemover);
            }
            if (alertasParaAdicionar.Any())
            {
                _context.CF_PostagemAlertas.AddRange(alertasParaAdicionar);
            }
            // Para 'alertasParaAtualizar', o Entity Framework Core já rastreia as mudanças nos objetos
            // que foram obtidos do contexto, então um 'UpdateRange' explícito não é estritamente necessário aqui,
            // pois as modificações já foram feitas nos próprios objetos.

            // 8. Salva todas as alterações da postagem e dos alertas no banco de dados.
            // 'Update(postagem)' informa ao Entity Framework que a postagem foi modificada.
            _context.CF_Postagem.Update(postagem);
            // 'SaveChanges()' persiste todas as mudanças rastreadas (postagem, remoções, adições, atualizações de alertas).
            _context.SaveChanges();

            // Retorna a postagem que acabou de ser editada.
            return postagem;
        }

        public Postagem TrocarFlagAtivaPostagem(int idPostagem)
        {
            Postagem postagem = _context.CF_Postagem.Find(idPostagem);
            if (postagem is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            postagem.Fl_Ativo = !postagem.Fl_Ativo;

            _context.CF_Postagem.Update(postagem);
            _context.SaveChanges();

            return postagem;
        }


        public PostagensPaginadasDTO FiltrarPostagensPorEditoria(int idEditoria, int pagina, int quantidade)
        {
            var query = _context.CF_Postagem
                .Include(p => p.Categoria)
                .Include(p => p.Status)
                .Where(p => p.Fl_Ativo == true && p.Id_Categoria == idEditoria)
                .OrderByDescending(p => p.DT_Criacao);

            var total = query.Count();

            var postagens = query
                .Skip((pagina - 1) * quantidade)
                .Take(quantidade)
                .ToList();

            var postagensDTO = MapearParaDTO(postagens);

            return new PostagensPaginadasDTO 
            {
                Total = total,
                Dados = postagensDTO
            };
        }
        public async Task<int> IncrementarVisualizacoesAsync(int idPostagem)
        {
            var postagem = await _context.CF_Postagem.FindAsync(idPostagem);

            if (postagem == null)
                throw new Exception("Postagem não encontrada.");

            postagem.Visualizacoes += 1;

            _context.Entry(postagem).Property(p => p.Visualizacoes).IsModified = true;
            await _context.SaveChangesAsync();

            return postagem.Visualizacoes;
        }

        public List<PostagemRequest> ObterMaisLidasUltimaSemana(int quantidade = 5)
        {
            var umaSemanaAtras = DateTime.Now.AddDays(-7);

            var postagens = _context.CF_Postagem
                .Where(p => p.DT_Criacao >= umaSemanaAtras && p.Fl_Ativo)
                .OrderByDescending(p => p.Visualizacoes)
                .Take(quantidade)
                .ToList();

            return MapearParaDTO(postagens);
        }




        #region /*Métodos de conversão*/
        private Postagem ConverterPostagem(PostagemResponse postagemResponse)
        {

            Postagem potagemConvertida = new Postagem()
            {
                Id_Categoria = postagemResponse.IdCategoria,
                Id_Status = postagemResponse.IdStatus,
                Titulo = postagemResponse.Titulo,
                Conteudo = postagemResponse.Conteudo,
                Descricao = postagemResponse.Descricao,
                Id_Usuario = postagemResponse.IdUsuario,
                Imagem_base64 = postagemResponse.Imagem,
                Texto_alterado_por_ia = postagemResponse.TextoAlteradoPorIA,
                Palavras_retiradas_por_ia = postagemResponse.PalavrasRetiradasPorIA
            };

            return potagemConvertida;

        }

        private List<PostagemRequest> MapearParaDTO(List<Postagem> postagens)
        {
            if (postagens == null || !postagens.Any())
                return new List<PostagemRequest>();

            return postagens.Select(postagem => new PostagemRequest
            {
                IdPostagem = postagem.Id_Postagem,
                IdCategoria = postagem.Id_Categoria,
                NomeCategoria = postagem.Categoria?.Nome ?? "Categoria não encontrada",

                IdStatus = postagem.Id_Status,
                NomeStatus = postagem.Status?.Descricao ?? "Status não encontrado",

                IdUsuario = postagem.Id_Usuario,
                Titulo = postagem.Titulo,
                Conteudo = postagem.Conteudo,
                Descricao = postagem.Descricao,
                Imagem = postagem.Imagem_base64,
                TextoAlteradoPorIA = postagem.Texto_alterado_por_ia,
                PalavrasRetiradasPorIA = postagem.Palavras_retiradas_por_ia,
                DataCriacao = postagem.DT_Criacao,
                PremiumOuComum = postagem.Fl_Premium,
                Visualizacoes = postagem.Visualizacoes
            }).ToList();
        }


        #endregion

    }
}
