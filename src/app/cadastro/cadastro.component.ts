import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {

  
  formCadastro: FormGroup;

  nome = new FormControl(null);

  cpf = new FormControl(null);
  
  email = new FormControl(null);

  senha = new FormControl(null);

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.formCadastro = this.formBuilder.group({
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      senha: this.senha,
    });
  }

  realizarCadastro(){

  }

}
