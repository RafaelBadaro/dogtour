import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoricoPage } from './historico.page';
import { HistoricoPasseioComponent } from './historico-passeio/historico-passeio.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HistoricoPage }])
  ],
  declarations: [HistoricoPage, HistoricoPasseioComponent]
})
export class HistoricoPageModule {}
