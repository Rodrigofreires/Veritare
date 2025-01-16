export interface PerfilDeUsuarioRequest{
    IdUsuario: number;
    Nome: string;
    CPF: string;
    Email: string;
    Contato: string;
    TipoDeUsuario: number;
    Endereco: string;
    AcessoPremium: boolean;
    TempoDeAcesso: Date;
    DataDeNascimento: Date;
    PremiumExpiraEm?: Date | null;
}