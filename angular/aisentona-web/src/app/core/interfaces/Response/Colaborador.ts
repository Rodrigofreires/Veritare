export interface ColaboradorResponse{
    CadastroDeUsuario(infosColaborador: ColaboradorResponse): unknown;

    Nome: string;
    CPF: string;
    Email: string;
    Senha: string;
    Celular: string;
    DataNascimento: number;

}