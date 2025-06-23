using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using Microsoft.AspNetCore.Authorization; // Importante para usar [Authorize]
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColaboradorController : ControllerBase
    {
        private readonly ColaboradorService _colaboradorService;

        public ColaboradorController(ColaboradorService colaboradorService)
        {
            _colaboradorService = colaboradorService;
        }

        // --- Rotas de Visualização (Geralmente Públicas ou com Autenticação Básica) ---
        // Se desejar que estas rotas exijam apenas autenticação (qualquer usuário logado),
        // adicione [Authorize] sem Role ou Policy.

        [HttpGet("id")]
        public IActionResult GetTodosOsColaboradores(int id)
        {
            var colaborador = _colaboradorService.GetColaboradorPorId(id);
            if (colaborador == null)
            {
                return NotFound();
            }
            return Ok(colaborador);
        }

        [HttpGet("lista-colaboradores/")]
        public IActionResult GetTodosOsColaboradores()
        {
            var listaDeTodosOsColaboradores = _colaboradorService.ListarTodosOsColaboradores();
            if (listaDeTodosOsColaboradores == null)
            {
                return NotFound();
            }
            return Ok(listaDeTodosOsColaboradores);
        }

        [HttpGet("lista-perfil-usuarios")]
        [Authorize(Roles = "Administrador")]
        public IActionResult GetTodosUsuarios()
        {
            List<PerfilDeUsuarioRequest> listaDePerfisDeUsuarios = _colaboradorService.ListarTodosPerfis();
            if (listaDePerfisDeUsuarios == null || !listaDePerfisDeUsuarios.Any())
            {
                return NotFound("Nenhum usuário encontrado.");
            }
            return Ok(listaDePerfisDeUsuarios);
        }

        [HttpPost("listar-usuarios-filtros")]
        public IActionResult CarregarTodasAsPostagensPorFiltro([FromBody] PerfilDeUsuarioResponse filtro)
        {
            if (filtro == null)
            {
                return BadRequest("Filtros não fornecidos.");
            }

            var listaDePostagens = _colaboradorService.ListarUsuariosComFiltro(filtro);
            if (listaDePostagens == null)
            {
                return NotFound();
            }

            return Ok(listaDePostagens);
        }

        [HttpGet("perfil-usuario/{id}")]
        public IActionResult GetPerfilUsuario(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            var perfilDeUsuarioRequest = _colaboradorService.ListarPerfilDeUsuarioPorId(id);
            if (perfilDeUsuarioRequest == null)
            {
                return NotFound();
            }
            return Ok(perfilDeUsuarioRequest);
        }

        // --- Rotas de Gerenciamento de Colaboradores (Exclusivo para Administrador) ---

        [HttpPost]
        public IActionResult CreateColaborador([FromBody] ColaboradorResponse colaboradorResponse)
        {
            if (colaboradorResponse is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            var novoColaborador = _colaboradorService.CriarColaborador(colaboradorResponse);

            if (novoColaborador == null)
            {
                return BadRequest("Não foi possível criar o colaborador");
            }

            return CreatedAtAction(nameof(CreateColaborador), new { id = novoColaborador.Id_Usuario }, new { novoColaborador.Id_Usuario });
        }

        [HttpPut("editar-perfil-usuario")]
        // Somente usuários com a role "Administrador" podem editar perfis de usuário
        [Authorize(Roles = "Administrador")]
        public IActionResult UpdateColaborador([FromBody] PerfilDeUsuarioRequest perfilDeUsuarioRequest)
        {
            if (perfilDeUsuarioRequest == null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            try
            {
                _colaboradorService.EditarPerfilDeUsuario(perfilDeUsuarioRequest);
                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPut("ativar-desativar/{id}")]
        // Somente usuários com a role "Administrador" podem ativar/desativar colaboradores
        [Authorize(Roles = "Administrador")]
        public IActionResult SwapFlagColaborador(int id)
        {
            try
            {
                var colaborador = _colaboradorService.TrocarFlagAtivaColaborador(id);
                return Ok(colaborador);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}