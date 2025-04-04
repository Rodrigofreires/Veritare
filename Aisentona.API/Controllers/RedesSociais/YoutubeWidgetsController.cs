using Aisentona.Biz.Services.RedesSociais;
using Aisentona.DataBase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers.RedesSociais
{
    [Route("api/[controller]")]
    [ApiController]
    public class YoutubeWidgetsController : ControllerBase
    {
        private readonly YoutubeWidgetsService _service;

        public YoutubeWidgetsController(YoutubeWidgetsService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var widgets = _service.GetAll();
            return Ok(widgets);
        }

        [HttpPost]
        public IActionResult Create(YoutubeWidget widget)
        {
            var created = _service.Create(widget);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, YoutubeWidget updated)
        {
            var result = _service.Update(id, updated);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var success = _service.Delete(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
