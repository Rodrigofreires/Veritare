﻿using System.ComponentModel.DataAnnotations;

namespace Aisentona.DataBase
{
    public class ColaboradorTelefone
    {
        public ColaboradorTelefone()
        {
            
        }

        public ColaboradorTelefone(int id_Telefone, string? nm_Apelido, string? ds_Numero, bool fl_Ativo, DateTime? dT_Criacao, DateTime dT_UltimaAlteracao, string? ds_UltimaAlteracao, int id_Colaborador, Colaborador? colaborador)
        {
            Id_Telefone = id_Telefone;
            Nm_Apelido = nm_Apelido;
            Ds_Numero = ds_Numero;
            Fl_Ativo = fl_Ativo;
            DT_Criacao = dT_Criacao;
            DT_UltimaAlteracao = dT_UltimaAlteracao;
            Ds_UltimaAlteracao = ds_UltimaAlteracao;
            Id_Colaborador = id_Colaborador;
            Colaborador = colaborador;
        }

        [Key]
        public int Id_Telefone { get; set; }
        public string? Nm_Apelido { get; set; }
        public string? Ds_Numero { get; set; }
        public bool Fl_Ativo { get; set; }
        public DateTime? DT_Criacao { get; set; }
        public DateTime DT_UltimaAlteracao { get; set; }
        public string? Ds_UltimaAlteracao { get; set; }
        
        // Relacionamento com a tabela de Colaboradores
        public int Id_Colaborador { get; set; }
        public Colaborador? Colaborador { get; set; }


    }
}