import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { CadastroComponent } from './cadastro/cadastro.component';
import { CadastroCachorroComponent } from './cadastro-cachorro/cadastro-cachorro.component';
import { AvaliacaoDonoComponent } from './avaliacao-dono/avaliacao-dono.component';
import { CadastroHorariosComponent } from './cadastro-horarios/cadastro-horarios.component';

const routes: Routes = [
  {
    path: '' || 'login',
    component: LoginComponent
  },

  {
    path: 'avaliacao-dono',
    component: AvaliacaoDonoComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  },
  {
    path: 'cadastro-cachorro',
    canActivate: [AuthGuard],
    component: CadastroCachorroComponent
  },
  {
    path: 'cadastro-horarios',
    canActivate: [AuthGuard],
    component: CadastroHorariosComponent
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
