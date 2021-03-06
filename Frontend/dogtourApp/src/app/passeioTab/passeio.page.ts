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
          if (res.tours !== undefined) {

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

  private montarObjTour(item: any, itens: any): Tour {
    const tour: Tour = new Tour();
    tour.tour_id = item;
    tour.day = itens[item].day;
    tour.dog_id = itens[item].dog_id;
    tour.latitude = itens[item].latitude;
    tour.longitude = itens[item].longitude;
    tour.owner_id = itens[item].owner_id;
    tour.status = itens[item].status;
    tour.time = itens[item].time;
    tour.walker_id = itens[item].walker_id;

    return tour;
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
    // const body = {
    //   owner_id: this.authService.usuarioAuth.idUser,
    //   dog_id: this.cachorroAgora.idDog,
    //   walker_id: '',
    //   day: this.pegarDiaDaSemana(),
    //   time: new Date().toISOString(),
    //   latitude: this.latitude,
    //   longitude: this.longitude
    // };

    // this.http.post(constantes.textos.URL_API + '/api/tour/schedule', body,
    //   { headers: { 'Content-Type': 'text/plain' } }).subscribe(
    //     (res) => {
    //       this.loadingService.fecharLoading();
    //       this.router.navigate(['/tabs/passeioTab/passeio-encontrado']);
    //     },
    //     () => {
    //       this.loadingService.fecharLoading();
    //       this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao pedir agora');
    //     },
    //     () => {
    //       this.loadingService.fecharLoading();
    //     }
    //   );

    const body = {
      tour_id: this.tourAgendado.tour_id,
      status: '2'
    };

    this.http.post(constantes.textos.URL_API + '/api/tour/update', body,
      { headers: { 'Content-Type': 'text/plain' } }).subscribe(
        () => {
          this.loadingService.fecharLoading();
        },
        () => {
          this.loadingService.fecharLoading();
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
