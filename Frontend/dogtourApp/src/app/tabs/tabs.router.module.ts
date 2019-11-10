import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'passeioTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../passeioTab/passeio.module').then(m => m.PasseioPageModule)
          }
        ]
      },
      {
        path: 'historicoTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../historicoTab/historico.module').then(m => m.HistoricoPageModule)
          }
        ]
      },
      {
        path: 'contaTab',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../contaTab/conta.module').then(m => m.ContaPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/passeioTab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/passeioTab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
