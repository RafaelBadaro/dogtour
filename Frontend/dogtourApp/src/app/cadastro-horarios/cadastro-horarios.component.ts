import { Component, OnInit } from '@angular/core';
import { Horario } from '../models/horario.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cadastro-horarios',
  templateUrl: './cadastro-horarios.component.html',
  styleUrls: ['./cadastro-horarios.component.scss'],
})
export class CadastroHorariosComponent implements OnInit {

  horariosCadastrados: Horario[];

  constructor(public authService: AuthService) { }

  ngOnInit() {
    if (this.authService.usuarioAuth.horarios !== undefined) {
      this.horariosCadastrados = this.authService.usuarioAuth.horarios;
    } else {
      this.horariosCadastrados = [];
      this.novoHorario();
    }
  }

  public novoHorario() {
    const novoHorario = new Horario();
    novoHorario.id = this.horariosCadastrados.length;
    this.horariosCadastrados.push(novoHorario);
  }

  public salvarHorarios() {
    console.log(this.horariosCadastrados);
    if (this.authService.usuarioAuth.horarios === undefined) {
      this.authService.usuarioAuth.horarios = [];
    }
    this.authService.usuarioAuth.horarios = this.horariosCadastrados;
  }



}
