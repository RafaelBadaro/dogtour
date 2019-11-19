import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';
import { constantes } from '../constantes';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro-cachorro.component.html',
  styleUrls: ['./cadastro-cachorro.component.scss']
})
export class CadastroCachorroComponent implements OnInit {
  formCadastroCachorro: FormGroup;

  name = new FormControl('', Validators.required);

  size = new FormControl('', Validators.required);

  temper = new FormControl('', Validators.required);

  sex = new FormControl('', Validators.required);

  constructor(private authService: AuthService, private loadingService: LoadingService,
              private formBuilder: FormBuilder, private http: HttpClient,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.formCadastroCachorro = this.formBuilder.group({
      name: this.name,
      size: this.size,
      temper: this.temper,
      sex: this.sex
    });
  }

  realizarCadastroCachorro() {
    this.loadingService.mostrarLoading();

    const obj = {
      user_id: this.authService.usuarioAuth.idUser,
      name: this.name.value,
      sex: this.sex.value,
      size: this.size.value,
      temper: this.temper.value,
    };

    this.http.post(constantes.textos.URL_API + '/api/dog', obj,
      { headers: { 'Content-Type': 'text/plain' } }).subscribe(
        () => {
          this.authService.setUsuarioAuth().then(val => {
            this.loadingService.fecharLoading();
            this.alertService.abrirAlert(constantes.textos.sucesso.TXT_SUCESSO, constantes.textos.sucesso.CADASTRO);
            this.router.navigate(['/tabs/passeioTab']);
          });
        },
        () => {
          this.loadingService.fecharLoading();
          this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, constantes.textos.erros.CADASTRO);
        },
        () => {
          this.loadingService.fecharLoading();
        }
      );
  }
}
