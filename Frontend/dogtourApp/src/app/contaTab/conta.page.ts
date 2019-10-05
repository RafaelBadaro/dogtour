import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-conta',
  templateUrl: 'conta.page.html',
  styleUrls: ['conta.page.scss']
})
export class ContaPage implements OnInit  {

  usuario: Usuario;

  cachorrosUsuario: any[];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.usuario =  this.authService.usuarioAuth;
  }
  
}
