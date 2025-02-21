export interface PerfilDeUsuarioRequest {
    IdUsuario: number;
    nome: string;
    cpf: string;
    email: string;
    contato: string;
    tipoDeUsuario: string;
    endereco: string | null; // Pode ser null
    acessoPremium: boolean;
    tempoDeAcesso: Date; // Use string, pois datas vêm como ISO string
    dataDeNascimento: Date; // Use string e converta para Date se necessário
    premiumExpiraEm: Date | null; // Pode ser null
  }
  