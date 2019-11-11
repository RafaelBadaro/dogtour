import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Cachorro } from '../models/cachorro.model';

@Component({
  selector: 'app-conta',
  templateUrl: 'conta.page.html',
  styleUrls: ['conta.page.scss']
})
export class ContaPage implements OnInit {

  formConta: FormGroup;

  password = new FormControl('', Validators.required);

  constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formConta = this.formBuilder.group({
      password: this.password
    });
  }

  public logout(){
    this.authService.logOut();
  }

  public atualizarSenha(){
    
  }

}
