import { Component, OnInit } from '@angular/core';
import { Horario } from '../models/horario.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { constantes } from '../constantes';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-cadastro-horarios',
  templateUrl: './cadastro-horarios.component.html',
  styleUrls: ['./cadastro-horarios.component.scss'],
})
export class CadastroHorariosComponent implements OnInit {

  horariosCadastrados: Horario[];

  constructor(private http: HttpClient, private router: Router, public authService: AuthService, 
    private loadingService: LoadingService, private alertService: AlertService) { }

  ngOnInit() {
    if (this.authService.usuarioAuth.horarios !== undefined) {
      this.horariosCadastrados = this.authService.usuarioAuth.horarios;
    } else {
      this.horariosCadastrados = [];
      this.novoHorario();
    }
  }

  ngAfterViewInit(){
    if (this.authService.usuarioAuth.horarios !== undefined) {
      this.horariosCadastrados = this.authService.usuarioAuth.horarios;
    } else {
      this.horariosCadastrados = [];
      this.novoHorario();
    }
  }


  public atualizarLista(event) {
    this.horariosCadastrados = event;
  }

  public novoHorario() {
    const novoHorario = new Horario();
    novoHorario.id = this.horariosCadastrados.length;
    this.horariosCadastrados.push(novoHorario);
  }

  public salvarHorarios() {
    if (this.authService.usuarioAuth.horarios === undefined) {
      this.authService.usuarioAuth.horarios = [];
    }
    
    this.authService.usuarioAuth.horarios = this.horariosCadastrados;
    this.authService.usuarioAuth.horarios.forEach((h)=> {
      this.loadingService.mostrarLoading();
      const objHora = {
        user_id: this.authService.usuarioAuth.idUser,
        day: h.diaDaSemana,
        time: h.hora
      }
      this.http.post(constantes.textos.URL_API + '/api/user/availability', objHora, {
        headers: { 'Content-Type': 'text/plain' }
      }).subscribe(
        () => {
          this.loadingService.fecharLoading();
         // this.alertService.abrirAlert(constantes.textos.sucesso.TXT_SUCESSO, 'Seus horários foram cadastrados com sucesso!');
        },
        ()=>{
          this.loadingService.fecharLoading();
        //  this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Ocorreu um erro ao');
        })
    })

  }



}
