import { Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { constantes } from '../constantes';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';

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
              private alertService: AlertService) {

    this.formAgendamento = this.formBuilder.group({
      passeador: this.passeador,
      horario: this.horario
    });
    const u = new Usuario();
    u.name = 'NOME';
    u.role = 'a';
    u.email = 'email';
    u.dogs = [];

    this.passeadores.push(u);

    const u2 = new Usuario();
    u2.name = 'Willer';
    u2.role = 'a';
    u2.email = 'email';
    u2.dogs = [];

    this.passeadores.push(u2);
  }

  public agendar() {
    this.alertService.abrirAlert(constantes.textos.passeio.PASSEIO_AGENDADO_COM_SUCESSO,
       'Horario:' + this.horario.value + ' Passeador:' + this.passeador.value);
  }

  public pedirAgora() {

  }

}
