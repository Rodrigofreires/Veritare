using Aisentona.DataBase;
using Aisentona.Entities.Response;
using Aisentona.Enumeradores;
using Microsoft.EntityFrameworkCore;

namespace Aisentona.Biz.Services.Premium
{
    public class PremiumService
    {
        private readonly ApplicationDbContext _context;

        public PremiumService(ApplicationDbContext postagemContext)
        {
            _context = postagemContext;
        }

        public void TornarUsuarioPremium(PremiumResponse premiumResponse)
        {
            Colaborador colaborador = _context.CF_Colaborador.Include(c => c.AcessoUsuario).FirstOrDefault(x => x.Id_Usuario == premiumResponse.IdUsuario);

            if (colaborador != null)
            {

                colaborador.Id_TipoUsuario = (int)Autorizacao.LeitorPremium;
                colaborador.AcessoUsuario.Fl_AcessoPremium = true;
                colaborador.AcessoUsuario.Id_Plano = premiumResponse.IdTipoPlanoPremium;
                colaborador.AcessoUsuario.Dt_InicioAcesso = DateTime.Now;


                // Atualiza as datas de acesso conforme o plano
                AtualizarDatasDeAcesso(colaborador, premiumResponse);
            }

            _context.CF_Colaborador.Update(colaborador);
            _context.SaveChanges();
        }

        public void TirarUsuarioPremium(PremiumResponse premiumResponse)
        {
            Colaborador colaborador = _context.CF_Colaborador.Include(c => c.AcessoUsuario).FirstOrDefault(x => x.Id_Usuario == premiumResponse.IdUsuario);

            if (colaborador != null)
            {
                colaborador.Id_TipoUsuario = (int)Autorizacao.LeitorSimples;
                colaborador.AcessoUsuario.Fl_AcessoPremium = false;
                colaborador.AcessoUsuario.Id_Plano = null;
                colaborador.AcessoUsuario.Dt_FimAcesso = DateTime.Now; // Remove a data de expiração do Premium

                _context.CF_Colaborador.Update(colaborador);
                _context.SaveChanges();
            }
        }

        private void AtualizarDatasDeAcesso(Colaborador colaborador, PremiumResponse premiumResponse)
        {
            // Obtém o ID do tipo de plano associado ao acesso
            var idAcessoPremium = colaborador.AcessoUsuario.Id_Plano;

            DateTime dataInicioAcesso = (DateTime)colaborador.AcessoUsuario.Dt_InicioAcesso;


            // Calcula a data de fim dependendo do tipo de plano
            if (idAcessoPremium == (int)TipoDePlanoPremium.Mensal)  // Mensal
            {
                colaborador.AcessoUsuario.Dt_FimAcesso = dataInicioAcesso.AddMonths(1);

            }
            else if (idAcessoPremium == (int)TipoDePlanoPremium.Semestral)  // Semestral
            {
                colaborador.AcessoUsuario.Dt_FimAcesso = dataInicioAcesso.AddMonths(6);
            }
            else if (idAcessoPremium == (int)TipoDePlanoPremium.Mensal)  // Anual
            {
                colaborador.AcessoUsuario.Dt_FimAcesso = dataInicioAcesso.AddYears(1);
            }
            else if (idAcessoPremium == null)  // Caso o plano seja inválido ou usuário não seja premium
            {
                return;
            }

            else
            {
                throw new ArgumentException("Tipo de plano não reconhecido.");
            }
        }







    }
}
