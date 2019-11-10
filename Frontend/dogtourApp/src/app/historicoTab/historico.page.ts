import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historico',
  templateUrl: 'historico.page.html',
  styleUrls: ['historico.page.scss']
})
export class HistoricoPage {

  constructor(private router: Router) {}

  public irTelaAvaliacao(){
    // if(perfil == dono){
    //  this.router.navigate(['/avaliacao-passeador']);
    // }else{
    //  this.router.navigate(['/avaliacao-dono']);
    // }
    this.router.navigate(['/avaliacao-dono']);
  }

}
