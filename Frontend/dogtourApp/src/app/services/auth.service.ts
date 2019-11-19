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


  public async setUsuarioAuth() {
    const token = this.getToken();
    await this.http.get(constantes.textos.URL_API + '/api/user/' + token).toPromise().then(
      (res: any) => {
        this.usuarioAuth.idUser = res.user.user_id;
        this.usuarioAuth.email = res.user.email;
        this.usuarioAuth.name = res.user.name;
        this.usuarioAuth.role = res.user.role;
        this.usuarioAuth.dogs = [];
        this.usuarioAuth.horarios = [];

        if (this.usuarioDono) {
          this.requestBuscarCachorros(token);
        }

        if (this.usuarioPasseador) {
          const horarios = this.requestBuscarHorarios(token);
          this.usuarioAuth.horarios.push(...horarios);
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


  public requestBuscarCachorros(token: string): void {
    this.http.get(constantes.textos.URL_API + '/api/user/' + token + '/dogs').subscribe(
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

  public requestBuscarHorarios(token: string): Horario[] {
    const horarios: Horario[] = [];
    this.http.get(constantes.textos.URL_API + '/api/user/' + token + '/availability').subscribe(
      (res: any) => {
        if (res.availability !== undefined) {
          // tslint:disable-next-line: forin
          for (const hr in res.availability) {
            const diaDaSemana = hr;
            const times = res.availability[hr];
            const horariosPorDiaSemana: Horario[] = [];
            // tslint:disable-next-line: forin
            for (const time in times) {
              const horarioFinal = new Horario();
              horarioFinal.diaDaSemana = diaDaSemana;
              horarioFinal.hora = times[time];
              horariosPorDiaSemana.push(horarioFinal);
            }
            horarios.push(...horariosPorDiaSemana);
          }
        }
      },
      () => { }
    );
    return horarios;
  }

}
