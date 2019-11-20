import { Component, OnInit } from '@angular/core';
import { Horario } from '../models/horario.model';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
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
    private loadingService: LoadingService, private alertService: AlertService,
    private route: ActivatedRoute) {

    route.params.subscribe(val => {
      if (this.authService.usuarioAuth.idUser !== undefined) {
        this.ngOnInit();
      }else{
        this.router.navigate(['/login']);
      }

    });
  }


  ngOnInit() {
    if (this.authService.usuarioAuth.idUser !== undefined) {
      if (this.authService.usuarioAuth.horarios !== undefined) {
        this.horariosCadastrados = this.authService.usuarioAuth.horarios;
      } else {
        this.horariosCadastrados = [];
        this.novoHorario();
      }
    } else {
      this.router.navigate(['/login']);
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
    this.loadingService.mostrarLoading();
    if (this.authService.usuarioAuth.horarios === undefined) {
      this.authService.usuarioAuth.horarios = [];
    }
    this.authService.usuarioAuth.horarios = this.horariosCadastrados;

    let listaHoras = [];
    this.authService.usuarioAuth.horarios.forEach((h) => {
      const objHora = {
        day: h.diaDaSemana,
        time: h.hora
      };
      listaHoras.push(objHora);
    });

    const body = {
      user_id: this.authService.usuarioAuth.idUser,
      availability: listaHoras,
    };

    this.http.post(constantes.textos.URL_API + '/api/user/availability', body, {
      headers: { 'Content-Type': 'text/plain' }
    }).subscribe(
      () => {
        this.loadingService.fecharLoading();
        // this.alertService.abrirAlert(constantes.textos.sucesso.TXT_SUCESSO, 'Seus horários foram cadastrados com sucesso!');
      },
      () => {
        this.loadingService.fecharLoading();
        //  this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Ocorreu um erro ao');
      });


  }



}
