import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VirtualTimeScheduler } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';
import { constantes } from '../constantes';

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
    private router: Router) { }

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
    }

    this.http.post(constantes.textos.urlApi + '/api/dog', obj, 
    { headers: { 'Content-Type': 'text/plain' }}).subscribe(
      res => {
        this.loadingService.fecharLoading();
        this.router.navigate(['/tabs/passeioTab']);
      },
      err => {
        this.loadingService.fecharLoading();
        this.router.navigate(['/login']);
      },
      () => {
        this.loadingService.fecharLoading();
      }
    );
  }
}
