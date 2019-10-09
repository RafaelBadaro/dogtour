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
  name = new FormControl('');
  email = new FormControl('');
  password = new FormControl('');

  cachorrosUsuario: Cachorro[] = [];

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formConta = this.formBuilder.group({
      name: this.name,
      email: this.email,
      password: this.password,
    });

    this.name.setValue(this.authService.usuarioAuth.name);
    this.email.setValue(this.authService.usuarioAuth.email);
    var c = new Cachorro();
    if(this.authService.usuarioAuth.dogs !== undefined ){
    c.name = this.authService.usuarioAuth.dogs['Biju'].name;
    c.sex = this.authService.usuarioAuth.dogs['Biju'].sex;
    c.size = this.authService.usuarioAuth.dogs['Biju'].size;
    c.temper = this.authService.usuarioAuth.dogs['Biju'].temper;
    this.cachorrosUsuario.push(c);
    }
  }

  atualizarDados() {
    console.log(this.formConta.value);
  }
  atualizarListaCachorros(dog: Cachorro) {
  }

}
