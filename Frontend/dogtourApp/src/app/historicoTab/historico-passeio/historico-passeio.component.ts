import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historico-passeio',
  templateUrl: './historico-passeio.component.html',
  styleUrls: ['./historico-passeio.component.scss'],
})
export class HistoricoPasseioComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}


  public irTelaAvaliacao(){
    this.router.navigate(['/avaliacao-dono']);
  }
}
