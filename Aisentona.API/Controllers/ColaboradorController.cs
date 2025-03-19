using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet]
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
        public IActionResult GetTodosUsuarios()
        {
            List<PerfilDeUsuarioRequest> listaDePerfisDeUsuarios = _colaboradorService.ListarTodosPerfis();
            if (listaDePerfisDeUsuarios == null || !listaDePerfisDeUsuarios.Any())
            {
                return NotFound("Nenhum usuário encontrado.");
            }
            return Ok(listaDePerfisDeUsuarios);
        }

        [HttpPost("/listar-usuarios-filtros")]
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

        // POST api/<ColaboradorController>
        [HttpPost]
        public IActionResult CreateColaborador([FromBody] ColaboradorResponse colaboradorResponse)
        {
            if (colaboradorResponse is null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            // Criar um novo colaborador usando o serviço
            var novoColaborador = _colaboradorService.CriarColaborador(colaboradorResponse);

            if (novoColaborador == null)
            {
                return BadRequest("Não foi possível criar o colaborador");
            }

            // Retornar um código 201 (Created) com o novo colaborador criado
            return CreatedAtAction(nameof(CreateColaborador), new { id = novoColaborador.Id_Usuario }, new { novoColaborador.Id_Usuario });

        }

        // PUT api/<ColaboradorController>
        [HttpPut("editar/{id}")]
        public IActionResult UpdateColaborador(int id, [FromBody] ColaboradorRequest colaboradorRequest)
        {
            if (colaboradorRequest == null)
            {
                return BadRequest("Objeto preenchido incorretamente");
            }

            try
            {
                var colaborador = _colaboradorService.EditarColaborador(id, colaboradorRequest);

                return Ok(colaborador);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // Delete api/<ColaboradorController>
        [HttpPut("ativar-desativar/{id}")]
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
