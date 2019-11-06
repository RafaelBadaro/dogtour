import { Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { constantes } from '../constantes';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passeio',
  templateUrl: 'passeio.page.html',
  styleUrls: ['passeio.page.scss']
})
export class PasseioPage {

  formAgendamento: FormGroup;

  passeador = new FormControl('', Validators.required);

  horario = new FormControl('', Validators.required);

  passeadores: Usuario[] = [];

  constructor(private formBuilder: FormBuilder, private loadingService: LoadingService,
              private alertService: AlertService, private router: Router) {

    this.formAgendamento = this.formBuilder.group({
      passeador: this.passeador,
      horario: this.horario
    });
    const u = new Usuario();
    u.name = 'NOME';
    u.role = 'a';
    u.email = 'email';
    u.dogs = [];
    u.horarios = ['Data e hora 1', 'Data e hora 2'];

    this.passeadores.push(u);

    const u2 = new Usuario();
    u2.name = 'Willer';
    u2.role = 'a';
    u2.email = 'email';
    u2.dogs = [];
    u2.horarios = ['Data e hora 3', 'Data e hora 4'];

    this.passeadores.push(u2);
  }

  public agendar() {
    this.alertService.abrirAlert(constantes.textos.passeio.PASSEIO_AGENDADO_COM_SUCESSO,
       'Horario: ' + this.horario.value + ' - Passeador: ' + this.passeador.value.name);
  }

  public pedirAgora() {
    this.router.navigate(['/tabs/passeioTab/passeio-encontrado']);
  }

}
