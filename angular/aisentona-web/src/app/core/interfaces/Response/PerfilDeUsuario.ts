export interface PerfilDeUsuarioResponse {
  IdUsuario: number;
  Nome: string;
  Email: string;
  Contato: string;
  nomeTipoDeUsuario: string;
  IdTipoUsuario: number;
  TempoDeAcesso: string; // Use string, pois datas vêm como ISO string
  DataDeNascimento: string; // Use string e converta para Date se necessário
  Endereco: string | null; // Pode ser null
  CPF: string;
  AcessoPremium: boolean;
  PremiumExpiraEm: string | null; // Pode ser null
  }