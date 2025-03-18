import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CadastroDeNoticiaComponent } from './pages/cadastro-de-noticia/cadastro-de-noticia.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { PerfilDeUsuarioComponent } from './pages/perfil-de-usuario/perfil-de-usuario.component';
import { PaginaEditarNoticiaComponent } from './pages/pagina-editar-noticia/pagina-editar-noticia.component';
import { PaginaNoticiaComponent } from './pages/pagina-noticia/pagina-noticia.component';
import { ListagemPorEditoriaComponent } from './pages/listagem-por-editoria/listagem-por-editoria.component';
import { LoginComponent } from './authentication/login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { PainelDeControleComponent } from './pages/painel-de-controle/painel-de-controle.component';
import { AuthGuard } from '../guard';
import { RoleGuard } from '../role.guard';
import { SettingsComponent } from './pages/settings/settings.component';


export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'noticia/:id', component: PaginaNoticiaComponent },
      { path: 'lista-noticia/:nomeCategoria/:idCategoria', component: ListagemPorEditoriaComponent },
      { 
        path: 'cadastro-de-noticia', 
        component: CadastroDeNoticiaComponent,
        canActivate: [AuthGuard, RoleGuard], 
        data: { role: ['CadastrarPostsSimples', 'CadastrarPostsPremium'] }
      },
      { 
        path: 'editar-noticia/:id', 
        component: PaginaEditarNoticiaComponent,
        canActivate: [AuthGuard, RoleGuard], 
        data: { role: ['EditarPostsSimples', 'EditarPostsPremium'] }
      },
      { 
        path: 'perfil-de-usuario/:id', 
        component: PerfilDeUsuarioComponent,
        canActivate: [AuthGuard] 
      },
      { 
        path: 'painel-de-controle', 
        component: PainelDeControleComponent,
        canActivate: [AuthGuard, RoleGuard], 
        data: { IdTipoDeUsuario: ['1', '2', '3'] }
      },

      { 
        path: 'painel-de-controle/settings', 
        component: SettingsComponent,
        canActivate: [AuthGuard, RoleGuard], 
        data: { IdTipoDeUsuario: ['1', '2'] }
      },

    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'cadastro-de-usuario', component: CadastroUsuarioComponent },
    ],
  },
];
