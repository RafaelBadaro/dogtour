import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { constantes } from '../constantes';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-passeio',
  templateUrl: 'passeio.page.html',
  styleUrls: ['passeio.page.scss']
})
export class PasseioPage implements OnInit {

  formAgendamento: FormGroup;

  passeador = new FormControl('', Validators.required);

  horario = new FormControl('', Validators.required);

  cachorro = new FormControl('', Validators.required);

  passeadores: Usuario[] = [];

  passeioAgendado = false;

  procuraPasseio = false;

  constructor(private formBuilder: FormBuilder, private loadingService: LoadingService,
    private router: Router, public authService: AuthService, private alertService: AlertService) {

    this.formAgendamento = this.formBuilder.group({
      passeador: this.passeador,
      horario: this.horario,
      cachorro: this.cachorro
    });
    const u = new Usuario();
    u.name = 'Jorge';
    u.role = 'passeador';
    u.email = 'email';
    u.dogs = [];
    u.horarios = ['Data e hora 1', 'Data e hora 2'];

    this.passeadores.push(u);

  }

  ngOnInit(): void {
    if (this.authService.usuarioDono) {
      if (!this.authService.usuarioTemCachorros) {
        this.alertService.abrirAlert('Ei cara parece que você não possui cachorros cadastrados :(',
          'Você pode cadastrar alguns na tela de Conta no canto inferior direito');
      }
    }

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
    this.cachorro.setValue('');
  }

}
