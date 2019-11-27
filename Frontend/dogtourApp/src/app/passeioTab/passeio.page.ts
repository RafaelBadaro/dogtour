import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { constantes } from '../constantes';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Horario } from '../models/horario.model';
import { Cachorro } from '../models/cachorro.model';
import { HttpClient } from '@angular/common/http';
import { Tour, StatusTour } from '../models/tour.model';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-passeio',
  templateUrl: 'passeio.page.html',
  styleUrls: ['passeio.page.scss']
})
export class PasseioPage implements OnInit {

  formAgendamento: FormGroup;

  passeador = new FormControl('', Validators.required);

  horario = new FormControl('', Validators.required);

  cachorroAgendamento = new FormControl('', Validators.required);

  passeadores: Usuario[] = [];

  passeioAgendado = false;

  passeioConfirmado = false;

  procuraPasseio = false;

  cachorroAgora: Cachorro;

  tourAgendado: Tour = new Tour();

  tourAguardandoConfirmacao: Tour = new Tour();

  todosTours: Tour[] = [];

  toursAgendados: Tour[] = [];

  toursRequested: Tour[] = [];

  latitude: string;

  longitude: string;

  private diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  public get horariosEstaoDisponiveis(): boolean {
    return this.passeador.value.horarios !== undefined && this.passeador.value.horarios.length > 0;
  }

  constructor(private formBuilder: FormBuilder, private loadingService: LoadingService,
    private router: Router, public authService: AuthService,
    private alertService: AlertService, private http: HttpClient,
    private geolocation: Geolocation,
    private route: ActivatedRoute) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/tabs/passeioTab') {
          this.ngOnInit();
        }
      }
    });

    this.formAgendamento = this.formBuilder.group({
      passeador: this.passeador,
      horario: this.horario,
      cachorroAgendamento: this.cachorroAgendamento
    });
  }

  ngOnInit() {
    if (this.authService.usuarioAuth.idUser !== undefined) {
      if (this.authService.usuarioDono) {
        if (!this.authService.usuarioTemCachorros) {
          this.alertService.abrirAlert('Ei cara parece que você não possui cachorros cadastrados :(',
            'Você pode cadastrar alguns na tela de Conta no canto inferior direito');
        }
      }

      // Pega coordenadas
      this.geolocation.getCurrentPosition().then(
        (resp) => {
          this.latitude = resp.coords.latitude.toString();
          this.longitude = resp.coords.longitude.toString();
        }
      );

      if (this.authService.usuarioDono) {
        this.loadingService.mostrarLoading();
        this.http.get(constantes.textos.URL_API + '/api/users/passeador').subscribe(
          (res: any) => {
            // tslint:disable-next-line: forin
            for (const user in res.users) {
              const u: Usuario = new Usuario();
              u.email = res.users[user].email;
              u.name = res.users[user].name;
              u.idUser = res.users[user].user_id;
              u.role = res.users[user].role;
              u.rating = res.users[user].rating;
              if (this.passeadores.find((p) => p.idUser === u.idUser) === undefined) {
                this.passeadores.push(u);
              }

            }
            this.loadingService.fecharLoading();

          },
          () => {
            this.loadingService.fecharLoading();
          });

      }

      // Verifica se tem algum Tour agendado aguardando confirmacao
      this.http.get(constantes.textos.URL_API + '/api/user/' + this.authService.getToken() + '/tours').subscribe(
        (res: any) => {
          if (res.tours !== undefined && Object.entries(res.tours).length > 0) {

            if (this.authService.usuarioDono) {
              this.montarToursDono(res);
            }

            if (this.authService.usuarioPasseador) {
              this.montarToursPasseador(res);
            }
          }

        },
        () => {
          this.loadingService.fecharLoading();
          // this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao trazer tour agendado');
        }
      );

    } else {
      this.router.navigate(['/login']);
    }
  }


  private montarToursDono(res: any) {

    const toursDono: Tour[] = [];
    // tslint:disable-next-line: forin
    for (const tour in res.tours) {
      toursDono.push(this.montarObjTour(tour, res.tours));
    }
    const tourAguardando = toursDono.find(tourDono => tourDono.status === StatusTour.Aguardando_Confirmacao);

    const tourConfirmado = toursDono.find(tourDono => tourDono.status === StatusTour.Confirmado);

    const tourCancelado = toursDono.find(tourDono => tourDono.status === StatusTour.Cancelado);


    if (tourConfirmado !== undefined) {
      this.tourAgendado = tourConfirmado;
      this.passeioConfirmado = true;
      this.passeioAgendado = true;

      this.passeador.setValue(this.passeadores.find(p => p.idUser === this.tourAgendado.walker_id));

      const horario = new Horario();
      horario.diaDaSemana = this.tourAgendado.day;
      horario.hora = this.tourAgendado.time;
      this.horario.setValue(horario);

      this.cachorroAgendamento
        .setValue(this.authService.usuarioAuth.dogs
          .find(d => d.name === this.tourAgendado.dogName));

    } else if (tourAguardando !== undefined) {
      this.tourAguardandoConfirmacao = tourAguardando;
      this.passeioAgendado = true;

      this.passeador.setValue(this.passeadores.find(p => p.idUser === this.tourAguardandoConfirmacao.walker_id));

      const horario = new Horario();
      horario.diaDaSemana = this.tourAguardandoConfirmacao.day;
      horario.hora = this.tourAguardandoConfirmacao.time;
      this.horario.setValue(horario);

      this.cachorroAgendamento
        .setValue(this.authService.usuarioAuth.dogs
          .find(d => d.name === this.tourAguardandoConfirmacao.dogName));

    } else if (tourCancelado !== undefined) {
      this.passeioConfirmado = false;
      this.passeioAgendado = false;
      this.passeador.setValue('');
      this.horario.setValue('');
      this.cachorroAgendamento.setValue('');
    }

  }

  private montarToursPasseador(res: any) {
    this.todosTours = [];
    // tslint:disable-next-line: forin
    for (const tour in res.tours) {
      if (res.tours[tour].walker_id !== '' && (res.tours[tour].status === '0' || res.tours[tour].status === '1')) {
        const tourNovo: Tour = this.montarObjTour(tour, res.tours);
        this.todosTours.push(tourNovo);
      }
    }
  }

  private montarObjTour(tour: any, resTours: any): Tour {
    const tourMontado: Tour = new Tour();
    tourMontado.tour_id = tour;
    tourMontado.day = resTours[tour].day;
    tourMontado.time = resTours[tour].time;
    tourMontado.status = resTours[tour].status;
    tourMontado.latitude = resTours[tour].latitude;
    tourMontado.longitude = resTours[tour].longitude;

    if (resTours[tour].owner !== '') {
      tourMontado.dogName = resTours[tour].dog.name;
      tourMontado.ownerName = resTours[tour].owner.name;
      tourMontado.owner_id = resTours[tour].owner.user_id;
    }

    if (resTours[tour].walker !== '') {
      tourMontado.walkerName = resTours[tour].walker.name;
      tourMontado.walker_id = resTours[tour].walker.user_id;
    }


    return tourMontado;
  }

  private montarObjTourAgora(resTours: any): Tour {
    const tourMontado: Tour = new Tour();

    tourMontado.status = resTours.status;
    tourMontado.latitude = resTours.w_latitude;
    tourMontado.longitude = resTours.w_longitude;

    if (resTours.owner !== '') {
      tourMontado.dogName = resTours.dog.name;
      tourMontado.ownerName = resTours.owner.name;
      tourMontado.owner_id = resTours.owner.user_id;
    }

    if (resTours.walker !== '') {
      tourMontado.walkerName = resTours.walker.name;
      tourMontado.walker_id = resTours.walker.user_id;
    }


    return tourMontado;
  }

  public async buscarHorarioPasseador() {
    this.loadingService.mostrarLoading();
    if (this.passeador.value !== '') {
      this.passeador.value.horarios = [];
      await this.authService.requestBuscarHorarios(this.passeador.value.idUser).then(resp => {
        this.passeador.value.horarios = resp;
        this.loadingService.fecharLoading();
      });
    }

  }

  public agendar() {
    this.loadingService.mostrarLoading();
    this.passeioAgendado = true;


    const body = {
      owner_id: this.authService.usuarioAuth.idUser,
      dog_id: this.formAgendamento.value.cachorroAgendamento.idDog,
      walker_id: this.formAgendamento.value.passeador.idUser,
      day: this.formAgendamento.value.horario.diaDaSemana,
      time: this.formAgendamento.value.horario.hora,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.http.post(constantes.textos.URL_API + '/api/tour/schedule', body,
      { headers: { 'Content-Type': 'text/plain' } }).subscribe(
        (res) => {
          this.loadingService.fecharLoading();
          this.alertService.abrirAlert(constantes.textos.sucesso.TXT_SUCESSO, 'Pedido de passeio enviado com sucesso!');
        },
        () => {
          this.loadingService.fecharLoading();
          this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao agendar passeio agora');
        },
        () => {
          this.loadingService.fecharLoading();
        }
      );

  }

  public pedirAgora() {
    this.loadingService.mostrarLoading();
    const body = {
      owner_id: this.authService.usuarioAuth.idUser,
      dog_id: this.cachorroAgora.idDog,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.http.post(constantes.textos.URL_API + '/api/request/tour', body,
      { headers: { 'Content-Type': 'text/plain' } }).subscribe(
        (res: any) => {
          let tourAoVivo: Tour = new Tour();
          tourAoVivo = this.montarObjTourAgora(res.tour);
          this.authService.tourMatch.latitude = tourAoVivo.latitude;
          this.authService.tourMatch.longitude = tourAoVivo.longitude;
          this.authService.tourMatch.walkerName = tourAoVivo.walkerName;
          this.authService.tourMatch.walker_id = tourAoVivo.walker_id;
          this.loadingService.fecharLoading();
          this.router.navigate(['/tabs/passeioTab/passeio-encontrado']);
        },
        () => {
          this.loadingService.fecharLoading();
          this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao pedir agora');
        },
        () => {
          this.loadingService.fecharLoading();
        }
      );

  }

  togglePasseador() {
    if (!this.procuraPasseio) {
      this.procuraPasseio = true;
      // todos os donos que querem passeador
      this.http.get(constantes.textos.URL_API + '/api/tours/requested').subscribe(
        (res: any) => {
          if (res.tours !== undefined && Object.entries(res.tours).length > 0) {
            // tslint:disable-next-line: forin
            for (const tour in res.tours) {
              const tourAoVivo = this.montarObjTour(tour, res.tours);
              this.toursRequested.push(tourAoVivo);
            }
          }
        },
        () => {

        },
      );
    } else {
      this.procuraPasseio = false;
      this.toursRequested = [];
    }
  }


  confirmaPasseio(tourEscolhido) {
    this.authService.tourMatch.latitude = tourEscolhido.latitude;
    this.authService.tourMatch.longitude = tourEscolhido.longitude;
    this.authService.tourMatch.ownerName = tourEscolhido.ownerName;
    this.authService.tourMatch.dogName = tourEscolhido.dogName;

    const body = {
      tour_id: tourEscolhido.tour_id,
      user_id: this.authService.usuarioAuth.idUser,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.http.post(constantes.textos.URL_API + '/api/tour/confirm', body,
      { headers: { 'Content-Type': 'text/plain' } }).subscribe(
        (res: any) => {
          this.router.navigate(['/tabs/passeioTab/passeio-encontrado']);
        },
        () => {

        }
      );

  }

  public cancelar() {
    this.loadingService.mostrarLoading();
    this.passeioAgendado = false;
    this.passeioConfirmado = false;
    this.passeador.setValue('');
    this.horario.setValue('');
    this.cachorroAgendamento.setValue('');

    const body = {
      tour_id: this.tourAgendado.tour_id,
      status: '3'
    };

    this.http.post(constantes.textos.URL_API + '/api/tour/update', body,
      { headers: { 'Content-Type': 'text/plain' } }).subscribe(
        () => {
          this.loadingService.fecharLoading();
          this.alertService.abrirAlert(constantes.textos.sucesso.TXT_SUCESSO, 'Passeio cancelado!');
        },
        () => {
          this.loadingService.fecharLoading();
          this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao cancelar passeio');
        }
      );
  }

  private pegarDiaDaSemana(): string {
    const date = new Date();
    const diaSemana = date.getDay();
    return this.diasDaSemana[diaSemana];
  }
}
