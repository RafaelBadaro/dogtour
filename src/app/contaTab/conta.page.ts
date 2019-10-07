import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-conta',
  templateUrl: 'conta.page.html',
  styleUrls: ['conta.page.scss']
})
export class ContaPage implements OnInit {

  formConta: FormGroup;
  name = new FormControl('');
  email = new FormControl('');
  password = new FormControl('');

  usuario: Usuario;
  cachorrosUsuario: any[];

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.usuario = this.authService.usuarioAuth;

    this.formConta = this.formBuilder.group({
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }

  atualizarDados() {
    console.log(this.formConta.value);
  }

}
