// Conteúdo esperado para este arquivo:
export interface PremiumResponse {
  IdUsuario: number;
  idTipoPlanoPremium: number;
}

export enum TipoDePlanoPremium {
  Mensal = 1,
  Semestral = 2,
  Anual = 3,
}