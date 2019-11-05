import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Cachorro } from '../models/cachorro.model';

@Component({
  selector: 'app-conta',
  templateUrl: 'conta.page.html',
  styleUrls: ['conta.page.scss']
})
export class ContaPage implements OnInit {

  formConta: FormGroup;
  name = new FormControl({value: '', disabled: true});
  email = new FormControl({value: '', disabled: true});
  password = new FormControl('');

  cachorrosUsuario: Cachorro[] = [];

  constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formConta = this.formBuilder.group({
      name: this.name,
      email: this.email,
      password: this.password,
    });

    this.name.setValue(this.authService.usuarioAuth.name);
    this.email.setValue(this.authService.usuarioAuth.email);
    this.cachorrosUsuario = this.authService.usuarioAuth.dogs;
  }

  atualizarDados() {

  }
  atualizarListaCachorros(dog: Cachorro) {
  }

}
