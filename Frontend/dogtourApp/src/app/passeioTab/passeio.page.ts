import { Component, OnInit } from '@angular/core';
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
export class PasseioPage  implements OnInit {

  formAgendamento: FormGroup;

  passeador = new FormControl('', Validators.required);

  horario = new FormControl('', Validators.required);

  passeadores: Usuario[] = [];

  passeioAgendado = false;

  constructor(private formBuilder: FormBuilder, private loadingService: LoadingService, private router: Router) {

    this.formAgendamento = this.formBuilder.group({
      passeador: this.passeador,
      horario: this.horario
    });
  }

  ngOnInit(): void {
    
  }
 

  public agendar() {
    this.passeioAgendado = true;
  }

  public pedirAgora() {
    this.router.navigate(['/tabs/passeioTab/passeio-encontrado']);
  }

  public cancelar() {
    this.passeioAgendado = false;
    this.passeador.setValue('');
    this.horario.setValue('');
  }

}
