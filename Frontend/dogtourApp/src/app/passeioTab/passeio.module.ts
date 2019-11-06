import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasseioPage } from './passeio.page';
import { PasseioEncontradoComponent } from './passeio-encontrado/passeio-encontrado.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [{ path: '', component: PasseioPage },
      { path: 'passeio-encontrado', component: PasseioEncontradoComponent }])
  ],
  declarations: [PasseioPage, PasseioEncontradoComponent]
})
export class PasseioPageModule { }
