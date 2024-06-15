﻿
using Microsoft.IdentityModel.Tokens;
using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;
using System.Data.SqlTypes;

namespace Aisentona.Biz.Services
{
    public class ColaboradorService
    {
        private readonly ApplicationDbContext _context;  
        public ColaboradorService(ApplicationDbContext context)
        {
             _context = context;
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

        public Colaborador CriarColaborador(string nome, string cpf, string senha, int id_TipoUsuario)
        {
            Colaborador colaborador = new Colaborador()
            {
                Nm_Nome = nome,
                Ds_CPF = cpf,
                DS_Senha = senha,
                Fl_Ativo = true,
                DT_Criacao = DateTime.UtcNow,
                Id_TipoUsuario = id_TipoUsuario,
                Ds_UltimaAlteracao = GetWindowsUsername(),
            };

            // Lógica para salvar o colaborador no banco de dados
            _context.CF_Colaborador.Add(colaborador);
            _context.SaveChanges();

            return colaborador;
        }


        public Colaborador EditarColaborador(int id, Colaborador colaboradorDto)
        {
            var colaborador = _context.CF_Colaborador.Find(id);
            if (colaborador is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            colaborador.Nm_Nome = colaboradorDto.Nm_Nome;
            colaborador.Ds_CPF = colaboradorDto.Ds_CPF;
            colaborador.DS_Senha = colaboradorDto.DS_Senha;
            colaborador.Fl_Ativo = colaboradorDto.Fl_Ativo;
            colaborador.DT_UltimaAlteracao = DateTime.Now;
            colaborador.Id_TipoUsuario = colaboradorDto.Id_TipoUsuario;
            colaborador.Ds_UltimaAlteracao = GetWindowsUsername();

            // Verifica e ajusta as datas se necessário
            if (colaborador.DT_Criacao < (DateTime)SqlDateTime.MinValue)
            {
                colaborador.DT_Criacao = (DateTime)SqlDateTime.MinValue;
            }

            if (colaborador.DT_UltimaAlteracao < (DateTime)SqlDateTime.MinValue)
            {
                colaborador.DT_UltimaAlteracao = (DateTime)SqlDateTime.MinValue;
            }

            _context.CF_Colaborador.Update(colaborador);
            _context.SaveChanges();

            return colaborador;
        }

        public Colaborador TrocarFlagAtivaColaborador(int id)
        {
            var colaborador = _context.CF_Colaborador.Find(id);
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
