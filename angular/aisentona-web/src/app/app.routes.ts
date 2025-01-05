import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CadastroDeNoticiaComponent } from './pages/cadastro-de-noticia/cadastro-de-noticia.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { PerfilDeUsuarioComponent } from './pages/perfil-de-usuario/perfil-de-usuario.component';
import { PaginaEditarNoticiaComponent } from './pages/pagina-editar-noticia/pagina-editar-noticia.component';
import { PaginaNoticiaComponent } from './pages/pagina-noticia/pagina-noticia.component';
import { ListagemPorEditoriaComponent } from './pages/listagem-por-editoria/listagem-por-editoria.component';
import { EditoriaComponent } from './shared/editoria/editoria.component';
import { LoginComponent } from './authentication/login/login.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'noticia/:id',
    component: PaginaNoticiaComponent,
  },
  {
    path: 'lista-noticia/:nomeCategoria/:idCategoria',
    component: ListagemPorEditoriaComponent,
  },

  {
    path: 'cadastro-de-noticia',
    component: CadastroDeNoticiaComponent,
  },

  {
    path: 'editar-noticia/:id',
    component: PaginaEditarNoticiaComponent,
  },

  {
    path: 'cadastro-de-usuario',
    component: CadastroUsuarioComponent,
  },
  {
    path: 'perfil-de-usuario',
    component: PerfilDeUsuarioComponent,
  },
];

export class AppRoutingModule {}
