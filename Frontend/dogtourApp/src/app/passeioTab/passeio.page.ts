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
          if (res.tours !== undefined && Object.entries(res.tours).length > 0 && !this.tourPedidoNaHora(res)) {
            this.passeioAgendado = true;
            let jaPassou = false;
            // TODO POR FAVOR MUDAR ISSO
            for (const tour in res.tours) {
              if (!jaPassou) {
                this.tourAgendado.day = res.tours[tour].day;
                this.tourAgendado.dog_id = res.tours[tour].dog_id;
                this.tourAgendado.latitude = res.tours[tour].latitude;
                this.tourAgendado.longitude = res.tours[tour].longitude;
                this.tourAgendado.owner_id = res.tours[tour].owner_id;
                this.tourAgendado.status = res.tours[tour].status;
                this.tourAgendado.time = res.tours[tour].time;
                this.tourAgendado.walker_id = res.tours[tour].walker_id;
                const jaExiste = this.toursAgendados.find((ta) => {
                  return ta.day === this.tourAgendado.day && ta.time === this.tourAgendado.time;
                });
                if (jaExiste === undefined) {
                  this.toursAgendados.push(this.tourAgendado);
                }

                jaPassou = true;
              }
            }

            this.passeador.setValue(this.passeadores.find(p => p.idUser === this.tourAgendado.walker_id));
            const horario = new Horario();
            horario.diaDaSemana = this.tourAgendado.day;
            horario.hora = this.tourAgendado.time;
            this.horario.setValue(horario);

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

  private tourPedidoNaHora(res: any): boolean {
    const tours: Tour[] = [];
    // tslint:disable-next-line: forin
    for (const tour in res.tours) {
      tours.push(this.montarObjTour(tour, res.tours));
    }

    return tours.find(t => t.walker_id !== undefined) !== undefined;
  }

  private montarToursDono(res: any) {

    const toursDono: Tour[] = [];
    // tslint:disable-next-line: forin
    for (const tour in res.tours) {
      toursDono.push(this.montarObjTour(tour, res.tours));
    }
    const tourAguardando = toursDono.find(tourDono => tourDono.walker_id !== ''
      && tourDono.status === StatusTour.Aguardando_Confirmacao);

    const tourConfirmado = toursDono.find(tourDono => tourDono.walker_id !== '' &&
      tourDono.status === StatusTour.Confirmado);

    const tourCancelado = toursDono.find(tourDono => tourDono.walker_id !== '' &&
      tourDono.status === StatusTour.Cancelado);

    if (tourAguardando !== undefined) {
      this.tourAguardandoConfirmacao = tourAguardando;
      this.passeioAgendado = true;

      this.passeador.setValue(this.passeadores.find(p => p.idUser === this.tourAguardandoConfirmacao.walker_id));

      const horario = new Horario();
      horario.diaDaSemana = this.tourAguardandoConfirmacao.day;
      horario.hora = this.tourAguardandoConfirmacao.time;
      this.horario.setValue(horario);

      this.cachorroAgendamento
        .setValue(this.authService.usuarioAuth.dogs
          .find(d => d.idDog === this.tourAguardandoConfirmacao.dog_id));

    } else if (tourConfirmado !== undefined) {
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
          .find(d => d.idDog === this.tourAgendado.dog_id));

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

        // const jaExiste = this.todosTours.find((ta) => {
        //   return ta.tour_id === tourNovo.tour_id;
        // });

        // if (jaExiste !== undefined) {
        //   const index = this.todosTours.indexOf(jaExiste);
        //   this.todosTours.splice(index, 1);
        // }

        this.todosTours.push(tourNovo);
      }
    }
  }

  private montarObjTour(tour: any, resTours: any): Tour {
    const tourMontado: Tour = new Tour();
    tourMontado.tour_id = tour;
    tourMontado.day = resTours.tours[tour].day;
    tourMontado.dog_id = resTours.tours[tour].dog_id;
    tourMontado.latitude = resTours.tours[tour].latitude;
    tourMontado.longitude = resTours.tours[tour].longitude;
    tourMontado.owner_id = resTours.tours[tour].owner_id;
    tourMontado.status = resTours.tours[tour].status;
    tourMontado.time = resTours.tours[tour].time;
    tourMontado.walker_id = resTours.tours[tour].walker_id !== undefined ? resTours.tours[tour].walker_id : '';

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
        (res) => {
          //TODO PEGAR ESSA RESPOSTA
          //  // this.authService.usuarioMatch.idUser 
          //   this.authService.usuarioMatch.latitude
          //   this.authService.usuarioMatch.longitude
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
            for (const tour in res.tours) {
              const tourAoVivo = this.montarObjTourAoVivo(tour, res.tours);
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

  private montarObjTourAoVivo(tour: any, resTours: any){
    const tourMontado: Tour = new Tour();
    tourMontado.tour_id = tour;
    tourMontado.dog_id = resTours[tour].dog_id;
    tourMontado.latitude = resTours[tour].latitude;
    tourMontado.longitude = resTours[tour].longitude;
    tourMontado.owner_id = resTours[tour].owner_id;
    tourMontado.status = resTours[tour].status;


    return tourMontado;
  }

  confirmaPasseio(tourEscolhido) {
    this.authService.usuarioMatch.latitude = tourEscolhido.latitude;
    this.authService.usuarioMatch.longitude = tourEscolhido.longitude;

    const body = {
      tour_id: tourEscolhido.tour_id,
      user_id: this.authService.usuarioAuth.idUser
    };

    this.http.post(constantes.textos.URL_API + '/api/request/tour', body,
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
