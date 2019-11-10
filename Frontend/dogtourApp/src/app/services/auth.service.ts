import { Usuario } from '../models/usuario.model';
import { Injectable } from '@angular/core';
import { SettingsProvider } from '../settings-provider';
import { HttpClient } from '@angular/common/http';
import { Cachorro } from '../models/cachorro.model';
import { constantes } from '../constantes';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuarioAuth: Usuario;

  constructor(private http: HttpClient, private router: Router) {
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
    this.http.get(constantes.textos.urlApi + '/api/user/' + token).subscribe(
      (res: any) => {
        this.usuarioAuth.idUser = res.user.user_id;
        this.usuarioAuth.email = res.user.email;
        this.usuarioAuth.name = res.user.name;
        this.usuarioAuth.role = res.user.role;
        this.usuarioAuth.dogs = [];
      },
      () => {
        console.log('Erro ao trazer usuário');
      });
    this.http.get(constantes.textos.urlApi + '/api/user/' + token + '/dogs').subscribe(
      (res2: any) => {
        if (res2.dogs !== undefined) {
          for (let dog in res2.dogs) {
            let c: Cachorro = res2.dogs[dog];
            c.idDog = dog;
            this.usuarioAuth.dogs.push(c);
          }
        }
        
      },
      () => {
        console.log('Erro ao trazer cachorros do usuário');
      }
    )


  }


  public logOut() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
