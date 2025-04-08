import { PostagemRequest } from "../Request/Postagem";

export interface PostagensPaginadas {
  total: number;
  dados: PostagemRequest[];
}
