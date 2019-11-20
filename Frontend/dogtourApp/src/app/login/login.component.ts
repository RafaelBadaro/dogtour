import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { constantes } from '../constantes';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  formLogin: FormGroup;

  email = new FormControl('', Validators.required);

  password = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder, private router: Router,
              private http: HttpClient, private loadingService: LoadingService,
              private alertService: AlertService,
              private authService: AuthService) { }

  ngOnInit() {
    this.loadingService.mostrarLoading();
    if (this.authService.getToken() !== null && this.authService.getToken() !== '') {
      this.authService.setUsuarioAuth().then(result => {
        this.loadingService.fecharLoading();
        this.router.navigate(['/tabs/passeioTab']);
      });
    }

    this.formLogin = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
    this.loadingService.fecharLoading();
  }

  realizarLogin() {
    this.loadingService.mostrarLoading();
    this.http.post(constantes.textos.URL_API + '/api/login', this.formLogin.value, {
      headers: { 'Content-Type': 'text/plain' }
    }).subscribe(
      (res: any) => {
        this.email.setValue(undefined);
        this.password.setValue(undefined);

        sessionStorage.setItem('token', res.user_id);
        this.authService.setUsuarioAuth().then(result => {
          this.loadingService.fecharLoading();
          this.router.navigate(['/tabs/passeioTab']);
        });
      },
      () => {
        this.loadingService.fecharLoading();
        this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao tentar logar! Confira o email e a senha por favorzinho');
      },
      () => {
        this.loadingService.fecharLoading();
      }
    );
  }

}
