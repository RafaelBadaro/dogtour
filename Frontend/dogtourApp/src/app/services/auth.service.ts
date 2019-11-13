import { Usuario } from '../models/usuario.model';
import { Injectable } from '@angular/core';
import { SettingsProvider } from '../settings-provider';
import { HttpClient } from '@angular/common/http';
import { Cachorro } from '../models/cachorro.model';
import { constantes } from '../constantes';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuarioAuth: Usuario;

  public get usuarioDono(): boolean {
    return this.usuarioAuth.role === 'dono';
  }

  public get usuarioPasseador(): boolean {
    return this.usuarioAuth.role === 'passeador';
  }

  public get usuarioTemCachorros(): boolean {
    return this.usuarioDono && (this.usuarioAuth.dogs !== null && this.usuarioAuth.dogs.length > 0);
  }

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) {
    this.usuarioAuth = new Usuario();
  }


  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    if (token !== null && token.length > 0) {
      this.setUsuarioAuth();
      return true;
    } else {
      return false;
    }
  }


  private setUsuarioAuth(): void {
    const token = sessionStorage.getItem('token');
    this.http.get(constantes.textos.URL_API + '/api/user/' + token).subscribe(
      (res: any) => {
        this.usuarioAuth.idUser = res.user.user_id;
        this.usuarioAuth.email = res.user.email;
        this.usuarioAuth.name = res.user.name;
        this.usuarioAuth.role = res.user.role;
        this.usuarioAuth.dogs = [];
      },
      () => {
        this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao trazer usuário');
      });
    this.http.get(constantes.textos.URL_API + '/api/user/' + token + '/dogs').subscribe(
      (res2: any) => {
        if (res2.dogs !== undefined) {
          for (let dog in res2.dogs) {
            const c: Cachorro = res2.dogs[dog];
            c.idDog = dog;
            this.usuarioAuth.dogs.push(c);
          }
        }

      },
      () => {
        this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao trazer cachorros do usuário');
      }
    );


  }


  public logOut() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
