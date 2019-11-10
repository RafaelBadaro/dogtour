import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { constantes } from '../constantes';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {


  formCadastro: FormGroup;

  name = new FormControl('', Validators.required);

  email = new FormControl('', Validators.required);

  password = new FormControl('', Validators.required);

  role = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient,
    private alertService: AlertService, private loadingService: LoadingService) { }

  ngOnInit() {

    this.formCadastro = this.formBuilder.group({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    });
  }

  realizarCadastro() {
    this.loadingService.mostrarLoading();
    this.http.post(constantes.textos.URL_API + '/api/user', this.formCadastro.value, {
      headers: { 'Content-Type': 'text/plain' }
    }).subscribe(
      (res) => {
        this.loadingService.fecharLoading();
        this.alertService.abrirAlert(constantes.textos.sucesso.TXT_SUCESSO, constantes.textos.sucesso.CADASTRO);
        this.router.navigate(['/login']);
      },
      (err) => {
        this.loadingService.fecharLoading();
        this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro no cadastro de pessoas');
      },
      () => {
        this.loadingService.fecharLoading();
      }
    );
  }

}
