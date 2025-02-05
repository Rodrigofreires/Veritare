export interface PostagemResponse {
    titulo: string ;
    descricao: string;
    conteudo: string;
    idPostagem: number;
    idCategoria: number;
    idStatus: number;
    idUsuario: number;
    imagem: string;
    textoAlteradoPorIA: string;
    palavrasRetiradasPorIA: string;
    premiumOuComum: boolean;
  }