import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NoticiaComponent } from './pages/noticia/noticia.component';
import { CadastroDeNoticiaComponent } from './pages/cadastro-de-noticia/cadastro-de-noticia.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { PerfilDeUsuarioComponent } from './pages/perfil-de-usuario/perfil-de-usuario.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'noticia',
        component: NoticiaComponent
    },
    {
        path: 'cadastro-de-noticia',
        component: CadastroDeNoticiaComponent
    },
    {
        path: 'cadastro-de-usuario',
        component: CadastroUsuarioComponent
    },
    {
        path: 'perfil-de-usuario',
        component: PerfilDeUsuarioComponent
    },

];

export class AppRoutingModule {}