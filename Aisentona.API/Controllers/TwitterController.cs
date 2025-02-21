using Aisentona.Biz.Services.Compartilhar;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TwitterController : ControllerBase
    {
        private readonly TwitterService _twitterService;

        public TwitterController(TwitterService twitterService)
        {
            _twitterService = twitterService;
        }

        public class TweetRequest
        {
            public string Message { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> PostTweet([FromBody] TweetRequest request)
        {
            try
            {
                await _twitterService.PostTweetAsync(request.Message);
                return Ok(new { Message = "Tweet publicado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
   }

