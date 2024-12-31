export interface PostagemRequest {
    titulo: string;
    descricao: string;
    conteudo: string;
    idPostagem: number;
    idCategoria: number;
    nomeCategoria: string;
    idStatus: number;
    idUsuario: number;
    imagem: string;
    textoAlteradoPorIA: string;
    palavrasRetiradasPorIA: string;
    dataCriacao: string;

  }