export interface PerfilDeUsuarioRequest {
    IdUsuario: number;
    nome: string;
    cpf: string;
    email: string;
    contato: string;
    tipoDeUsuario: string;
    endereco: string | null; // Pode ser null
    acessoPremium: boolean;
    tempoDeAcesso: string; // Use string, pois datas vêm como ISO string
    dataDeNascimento: string; // Use string e converta para Date se necessário
    premiumExpiraEm: string | null; // Pode ser null
  }
  