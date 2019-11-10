import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { constantes } from '../constantes';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService) { }

  ngOnInit() {

    this.formLogin = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }



  realizarLogin() {

    const loginObj = {
      "email": this.email.value,
      "password": this.password.value
    }
    this.loadingService.mostrarLoading();
    this.http.post(constantes.textos.urlApi + '/api/login', this.formLogin.value, {
      headers: { 'Content-Type': 'text/plain' }
    }).subscribe(
      (res: any) => {
        this.email.setValue(undefined);
        this.password.setValue(undefined);

        sessionStorage.setItem('token', res.user_id);
        this.loadingService.fecharLoading();
        this.router.navigate(['/tabs/passeioTab']);
      },
      () => {
        this.loadingService.fecharLoading();
      },
      () => {
        this.loadingService.fecharLoading();
      }
    );
  }

}
