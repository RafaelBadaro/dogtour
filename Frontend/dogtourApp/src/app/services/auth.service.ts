import { Usuario } from '../models/usuario.model';
import { Injectable, forwardRef } from '@angular/core';
import { SettingsProvider } from '../settings-provider';
import { HttpClient } from '@angular/common/http';
import { Cachorro } from '../models/cachorro.model';
import { constantes } from '../constantes';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertService } from './alert.service';
import { Horario } from '../models/horario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuarioAuth: Usuario = new Usuario();

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
  }


  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    if (token !== null && token.length > 0) {
      return true;
    } else {
      return false;
    }
  }


  public async setUsuarioAuth() {
    const token = this.getToken();
    await this.http.get(constantes.textos.URL_API + '/api/user/' + token).toPromise().then(
      async (res: any) => {
        this.usuarioAuth.idUser = res.user.user_id;
        this.usuarioAuth.email = res.user.email;
        this.usuarioAuth.name = res.user.name;
        this.usuarioAuth.rating = res.user.rating;
        this.usuarioAuth.role = res.user.role;
        this.usuarioAuth.dogs = [];
        this.usuarioAuth.horarios = [];

        if (this.usuarioDono) {
          await this.requestBuscarCachorros(token);
        }

        if (this.usuarioPasseador) {
          await this.requestBuscarHorarios(token).then(result => {
            this.usuarioAuth.horarios.push(...result);
          });
        }
        return this.usuarioAuth;
      },
      () => {
        this.alertService.abrirAlert(constantes.textos.erros.TXT_ERRO, 'Erro ao trazer usuário');
      });
  }

  public getToken(): string {
    const token = sessionStorage.getItem('token');
    return token;
  }

  public logOut() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }


  public async requestBuscarCachorros(token: string) {
    await this.http.get(constantes.textos.URL_API + '/api/user/' + token + '/dogs').toPromise().then(
      (res: any) => {
        if (res.dogs !== undefined) {
          // tslint:disable-next-line: forin
          for (const dog in res.dogs) {
            const c: Cachorro = res.dogs[dog];
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

  public async requestBuscarHorarios(token: string): Promise<Horario[]> {
    const horariosPorDiaSemana: Horario[]  = [];
    await this.http.get(constantes.textos.URL_API + '/api/user/' + token + '/availability').toPromise().then(
      (res: any) => {
        if (res.availability !== undefined) {
 
          // tslint:disable-next-line: forin
          for (const dayTime in res.availability) {
            const horario: Horario = new Horario();
            horario.diaDaSemana = res.availability[dayTime].split('|')[0];
            horario.hora = res.availability[dayTime].split('|')[1];
            horariosPorDiaSemana.push(horario);
          }
        }
      },
      () => { }
    );
    return horariosPorDiaSemana;
  }

}
