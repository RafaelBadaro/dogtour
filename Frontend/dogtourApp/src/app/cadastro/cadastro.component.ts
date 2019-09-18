import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {


  formCadastro: FormGroup;

  nome = new FormControl('', Validators.required);

  cpf = new FormControl('', Validators.required);

  email = new FormControl('', Validators.required);

  senha = new FormControl('', Validators.required);

  role = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {

    this.formCadastro = this.formBuilder.group({
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      senha: this.senha,
      role: this.role,
    });
  }

  realizarCadastro() {
    this.http.post('localhost:8000/user', this.formCadastro).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      },
      ()=>{
        console.log('finalizei');
      }
    )
  }

}
