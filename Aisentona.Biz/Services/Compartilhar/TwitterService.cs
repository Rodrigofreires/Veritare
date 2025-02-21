using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tweetinvi;
using Tweetinvi.Models;

namespace Aisentona.Biz.Services.Compartilhar
{
    public class TwitterService
    {
        private readonly TwitterClient _client;

        public TwitterService()
        {
            _client = new TwitterClient("BrkUB1J28hchhCAkuQxKghUz3", "t5KJuudA1pVNY98X3Su1ywl6Orhh5yZmPacRksU61ogolqkG1Y", "1880197053986340864-V750akzjmsqe11fnrQQRKKSizvwPDh", "noaU6eftoMmhAXQYnfMOpisI2mFWIynPjFpoLTz7M6OOa");
        }

        public async Task PostTweetAsync(string message)
        {
            Console.WriteLine("📢 Iniciando postagem no Twitter...");

            var tweet = await _client.Tweets.PublishTweetAsync(message);

            Console.WriteLine("✅ Tweet publicado com sucesso: " + tweet);

            if (tweet == null)
            {
                throw new Exception("Erro ao publicar tweet: resposta nula.");
            }
        }

    }
}
