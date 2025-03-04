﻿using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using Aisentona.Entities.ViewModels;
using Aisentona.Enumeradores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;


namespace Aisentona.API.Controllers.Postagens
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostagemController : ControllerBase
    {
        private readonly PostagemService _postagemService;
        private readonly ApplicationDbContext _context;
        private readonly AuthService _authService;


        public PostagemController(PostagemService postagemService, ApplicationDbContext context, AuthService authService)
        {
            _postagemService = postagemService;
            _context = context;
            _authService = authService;
        }

        [HttpGet("{id}")]
        public IActionResult CarregarNotícia(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID inválido.");
            }

            PostagemRequest postagemRequest = _postagemService.CarregarPostagem(id);
            if (postagemRequest == null)
            {
                return NotFound();
            }
            return Ok(postagemRequest);
        }

        [HttpGet("listar-postagens")]
        public IActionResult CarregarListaDePostagens()
        {
            List<PostagemRequest> listaDePostagens = _postagemService.ListarPostagens();
            if (listaDePostagens == null)
            {
                return NotFound();
            }
            return Ok(listaDePostagens);
        }

        [HttpPost("listar-postagens/filtros")]
        public IActionResult CarregarTodasAsPostagensPorFiltro([FromBody] PostagemResponse filtro)
        {
            if (filtro == null)
            {
                return BadRequest("Filtros não fornecidos.");
            }

            var listaDePostagens = _postagemService.ListarPostagensComFiltro(filtro);
            if (listaDePostagens == null)
            {
                return NotFound();
            }

            return Ok(listaDePostagens);
        }


        [HttpGet("listar-ultimas-postagens")]
        public IActionResult ListarUltimasPostagens()
        {
            List<PostagemRequest> listaDePostagens = _postagemService.ListarUltimasPostagens();
            if (listaDePostagens == null)
            {
                return NotFound();
            }
            return Ok(listaDePostagens);
        }


        [HttpGet("listar-por-editoria/{idEditoria}")]
        public IActionResult FiltrarPostagensPorEditoria(int idEditoria)
        {
            List<PostagemRequest> listaDePostagensFiltradas = _postagemService.FiltrarPostagensPorEditoria(idEditoria);
            if (listaDePostagensFiltradas == null)
            {
                return NotFound();
            }
            return Ok(listaDePostagensFiltradas);
        }


        [HttpPost("criar-noticia")]
        [Authorize]
        public IActionResult CreatePost([FromBody] PostagemResponse postagemResponse)
        {
            // Validação do corpo da requisição
            if (postagemResponse is null)
            {
                return BadRequest("Objeto preenchido incorretamente.");
            }

            // Pegar ID e Permissões do Usuário Autenticado
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var regras = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(regras))
            {
                return Unauthorized("Usuário não autenticado.");
            }

            // Verificar se o role é válido
            if (!Enum.TryParse(regras, out Autorizacao autorizacao))
            {
                return Unauthorized("Role inválido.");
            }

            // Pegar as permissões associadas ao role
            var permissoes = autorizacao.GetPermissions(); // Método de extensão

            // Verificar se o usuário tem permissão para criar postagens
            if (!permissoes.Contains("CadastrarPostsSimples") && !permissoes.Contains("CadastrarPostsPremium"))
            {
                return Forbid("Você não tem permissão para criar postagens."); // Retorna 403 se não tiver permissão
            }

            // Criar a postagem
            var postagem = _postagemService.CriarPostagem(postagemResponse);
            return Ok(postagem); // Retorna a postagem criada com status 200
        }



        [HttpPut("editar/{idPostagem}")]

        public IActionResult UpdatePostagem(int idPostagem, [FromBody] PostagemResponse postagemResponse)
        {
            try
            {
                // Valida se o ID na rota corresponde ao ID no corpo da requisição
                if (idPostagem != postagemResponse.IdPostagem)
                {
                    return BadRequest("Inconsistência entre o ID da URL e o corpo da requisição.");
                }

                // Chama o serviço para atualizar a postagem
                var postagemAtualizada = _postagemService.EditarPostagem(postagemResponse);

                if (postagemAtualizada == null)
                {
                    return NotFound($"Postagem com ID {idPostagem} não encontrada.");
                }

                return Ok(postagemAtualizada);
            }
            catch (Exception ex)
            {
                // Log da exceção (não exibido aqui)
                return StatusCode(500, $"Erro interno no servidor: {ex.Message}");
            }
        }

        [HttpPut("ativar-desativar/{idPostagem}")]
        public IActionResult SwapFlagColaborador(int idPostagem)
        {
            try
            {
                var colaborador = _postagemService.TrocarFlagAtivaPostagem(idPostagem);
                return Ok(colaborador);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("listar-editorias")]
        public IActionResult ListarEditorias()
        {
            try
            {
                List<EditoriaDTO> editorias = _postagemService.ListarEditorias();
                return Ok(editorias);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("listar-status")]
        public IActionResult ListarStatus()
        {
            try
            {
                List<StatusDTO> status = _postagemService.ListarStatus();
                return Ok(status);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }



    }
}
