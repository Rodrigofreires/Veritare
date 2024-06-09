using Aisentona.Biz.Services;
using Aisentona.DataBase;
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

        // GET api/<ColaboradorController>
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            var colaborador = _colaboradorService.GetColaboradorById(id);
            if (colaborador == null)
            {
                return NotFound();
            }
            return Ok(colaborador);
        }

        // POST api/<ColaboradorController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ColaboradorController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ColaboradorController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
