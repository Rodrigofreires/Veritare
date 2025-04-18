﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Aisentona.Entities.Response
{
    public class PostagemResponse
    {

        public PostagemResponse(string titulo, string descricao, string conteudo, int idpostagem, int idCategoria, int idStatus, int idUsuario, string imagem, string textoAlteradoPorIA, string palavrasRetiradasPorIA, DateTime? dtCriacao, string premiumOuComum, List<AlertaResponse> listaDeAlertas)
        {
            Titulo = titulo;
            Descricao = descricao;
            Conteudo = conteudo;
            IdPostagem = idpostagem;
            IdCategoria = idCategoria;
            IdStatus = idStatus;
            IdUsuario = idUsuario;
            Imagem = imagem;
            TextoAlteradoPorIA = textoAlteradoPorIA;
            PalavrasRetiradasPorIA = palavrasRetiradasPorIA;
            DataCriacao = dtCriacao;
            PremiumOuComum = premiumOuComum;
            Alertas = listaDeAlertas;

        }

        public string Titulo { get; set; }
        public string Descricao {  get; set; }
        public string Conteudo { get; set; }
        public int IdPostagem { get; set; }
        public int IdCategoria { get; set; }
        public int IdStatus { get; set; }
        public int IdUsuario { get; set; }
        public string Imagem { get; set; }
        public string TextoAlteradoPorIA { get; set; }
        public string PalavrasRetiradasPorIA { get; set; }
        public DateTime? DataCriacao { get; set; }
        public string PremiumOuComum {  get; set; }
        public List<AlertaResponse> Alertas { get; set; }



    }
}
