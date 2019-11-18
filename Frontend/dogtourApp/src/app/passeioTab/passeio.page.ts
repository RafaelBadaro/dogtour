import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { constantes } from '../constantes';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Horario } from '../models/horario.model';
import { Cachorro } from '../models/cachorro.model';
import { HttpClient } from '@angular/common/http';

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

  procuraPasseio = false;

  cachorroAgora: Cachorro;

  public get horariosEstaoDisponiveis(): boolean {
    return this.passeador.value.horarios !== undefined && this.passeador.value.horarios.length > 0;
  }

  constructor(private formBuilder: FormBuilder, private loadingService: LoadingService,
    private router: Router, public authService: AuthService,
    private alertService: AlertService, private http: HttpClient) {

    this.formAgendamento = this.formBuilder.group({
      passeador: this.passeador,
      horario: this.horario,
      cachorroAgendamento: this.cachorroAgendamento
    });
  }

  ngOnInit(): void {
    if (this.authService.usuarioDono) {
      if (!this.authService.usuarioTemCachorros) {
        this.alertService.abrirAlert('Ei cara parece que você não possui cachorros cadastrados :(',
          'Você pode cadastrar alguns na tela de Conta no canto inferior direito');
      }
    }


    this.loadingService.mostrarLoading();
    this.http.get(constantes.textos.URL_API + '/api/users/passeador').subscribe(
      (res: any) => {
        // tslint:disable-next-line: forin
        for (const user in res.users) {
          const u: Usuario = res.users[user];
          this.passeadores.push(u);
        }
        this.loadingService.fecharLoading();

      },
      () => {
        this.loadingService.fecharLoading();
      });

  }

  //TODO - GET HORARIO DO PASSEADOR ESCOLHIDO
  public buscarHorarioPasseador() {
    this.passeador.value.horarios = [];
    const horarios = this.authService.requestBuscarHorarios(this.passeador.value.user_id);
    this.passeador.value.horarios = horarios;
  }

  public agendar() {
    this.passeioAgendado = true;
    this.formAgendamento.value;
  }

  public pedirAgora() {
    this.router.navigate(['/tabs/passeioTab/passeio-encontrado']);
  }

  public cancelar() {
    this.passeioAgendado = false;
    this.passeador.setValue('');
    this.horario.setValue('');
    this.cachorroAgendamento.setValue('');
  }

}
