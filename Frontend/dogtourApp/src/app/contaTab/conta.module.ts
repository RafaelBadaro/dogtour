import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContaPage } from './conta.page';
import { ContaCachorroComponent } from './conta-cachorro/conta-cachorro.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: ContaPage }])
  ],
  declarations: [ContaPage, ContaCachorroComponent]
})
export class ContaPageModule {}
