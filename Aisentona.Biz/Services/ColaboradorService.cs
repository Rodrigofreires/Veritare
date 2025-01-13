using Aisentona.DataBase;
using System.Security.Principal;
using System.Data.SqlTypes;
using Aisentona.Entities.Request;
using Aisentona.Enum;
using Aisentona.Biz.Validators;
using FluentValidation.Results;
using Aisentona.Entities.Response;
using FluentValidation;

namespace Aisentona.Biz.Services
{
    public class ColaboradorService
    {
        private readonly ApplicationDbContext _context;
        private readonly ColaboradorValidator _validator;

        public ColaboradorService(ApplicationDbContext context, ColaboradorValidator validator)
        {
             _context = context;
            _validator = validator;
        }

        private string GetWindowsUsername() => WindowsIdentity.GetCurrent().Name;

        public List<Colaborador>? ListarColaboradorPorId(int id)
        {
            var colaborador = _context.CF_Colaborador.FirstOrDefault(c => c.Id_Usuario == id);
            List<Colaborador> listaDeColaboradores = new List<Colaborador>();

            if (colaborador != null && colaborador.Fl_Ativo == true)
            {
                listaDeColaboradores.Add(colaborador);
            }
            return listaDeColaboradores;

        }

        public Colaborador CriarColaborador(ColaboradorResponse colaboradorResponse)
        {
            //Chamando as Validações do Colaborador
            ValidationResult validadores = _validator.Validate(colaboradorResponse);

            Colaborador novoColaborador = new();

            if (validadores.IsValid)
            {
                (byte[] hash, byte[] salt) = HashingUtils.GeneratePasswordHash(colaboradorResponse.Senha);

                novoColaborador.Nm_Nome = colaboradorResponse.Nome;
                novoColaborador.Ds_CPF = colaboradorResponse.CPF;
                novoColaborador.Ds_Email = colaboradorResponse.Email;
                novoColaborador.Ds_ContatoCadastro = colaboradorResponse.Celular;
                novoColaborador.Fl_Ativo = true;
                novoColaborador.DT_Criacao = DateTime.UtcNow;
                novoColaborador.DT_Nascimento = colaboradorResponse.DataNascimento;
                novoColaborador.DT_UltimaAlteracao = DateTime.UtcNow;
                novoColaborador.Id_TipoUsuario = (int)Autorizacao.LeitorSimples;
                novoColaborador.PasswordHash = hash;
                novoColaborador.PasswordSalt = salt;
                novoColaborador.Ds_UltimaAlteracao = GetWindowsUsername();        

                //Verificando se já existe um e-mail desses cadastrado no banco 
                var cpflExiste = _context.CF_Colaborador.Any(e => e.Ds_CPF == colaboradorResponse.CPF);
                if (cpflExiste) throw new Exception("Esser CPF já está em uso.");

                var emailExiste = _context.CF_Colaborador.Any(e => e.Ds_Email == colaboradorResponse.Email);
                if (emailExiste) throw new Exception("Esse E-mail já está em uso.");



                _context.CF_Colaborador.Add(novoColaborador);
                _context.SaveChanges();

            }

            return novoColaborador;
        }
        public Colaborador EditarColaborador(int idColaborador, ColaboradorRequest colaboradorRequest)
        {
            Colaborador colaborador = _context.CF_Colaborador.FirstOrDefault(x => x.Id_Usuario == idColaborador);
            if (colaborador == null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            int tipoDeUsuario = colaborador.Id_TipoUsuario;

            // Verifica permissões com base no papel
            switch (tipoDeUsuario)
            {
                case (int)Autorizacao.LeitorSimples:

                    // Usuário pode apenas editar informações básicas
                    colaborador.Nm_Nome = colaboradorRequest.Nome;
                    colaborador.DT_Nascimento = colaboradorRequest.DataNascimento;
                    break;
                case (int)Autorizacao.LeitorPremium:

                    // Usuário pode apenas editar informações básicas
                    colaborador.Nm_Nome = colaboradorRequest.Nome;
                    colaborador.DT_Nascimento = colaboradorRequest.DataNascimento;
                    break;
                case (int)Autorizacao.EditorBase:

                    // Usuário pode apenas editar informações básicas
                    colaborador.Nm_Nome = colaboradorRequest.Nome;
                    colaborador.DT_Nascimento = colaboradorRequest.DataNascimento;
                    break;
                case (int)Autorizacao.EditorChefe:

                    // Usuário pode apenas editar informações básicas
                    colaborador.Nm_Nome = colaboradorRequest.Nome;
                    colaborador.DT_Nascimento = colaboradorRequest.DataNascimento;
                    break;
                default:
                    throw new UnauthorizedAccessException("Permissão insuficiente para esta ação");
            }

                colaborador.DT_UltimaAlteracao = DateTime.Now;
                colaborador.Ds_UltimaAlteracao = GetWindowsUsername();

                if (colaborador.DT_UltimaAlteracao < (DateTime)SqlDateTime.MinValue)
                {
                    colaborador.DT_UltimaAlteracao = (DateTime)SqlDateTime.MinValue;
                }

            _context.CF_Colaborador.Update(colaborador);
            _context.SaveChanges();

            return colaborador;
        }
        public Colaborador TrocarFlagAtivaColaborador(int idColaborador)
        {
            var colaborador = _context.CF_Colaborador.Find(idColaborador);
            if (colaborador is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            colaborador.Fl_Ativo = !colaborador.Fl_Ativo;

            _context.CF_Colaborador.Update(colaborador);
            _context.SaveChanges();

            return colaborador;
        }

    }
}
