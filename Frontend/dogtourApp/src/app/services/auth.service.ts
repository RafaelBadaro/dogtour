import { Usuario } from '../models/usuario.model';
import { Injectable } from '@angular/core';
import { SettingsProvider } from '../settings-provider';
import * as jwtDecode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Cachorro } from '../models/cachorro.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private settingsProvider: SettingsProvider, private http: HttpClient) { }

  public usuarioAuth: Usuario = new Usuario();

  private config = this.settingsProvider.getConfiguration;

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    if(token !== null && token.length > 0){
      const decoded = this.getDecodedToken(token);
      if(decoded !== null){
        if(decoded.iss === this.config.iss){
          this.setUsuarioAuth();
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else {
      return false;
    }
    //return true;
  }

  private getDecodedToken(token: string){
    const decoded = jwtDecode(token);
    return decoded;
  }

  private setUsuarioAuth():void{
    const token = sessionStorage.getItem('token');
    this.http.get('api/user/' + token).subscribe(
      (user : any)=>{
        this.usuarioAuth.email = user['user'].email;
        this.usuarioAuth.name = user['user'].name;
        this.usuarioAuth.role = user['user'].role;
        this.usuarioAuth.dogs = [];
        if(user['user'].dogs !== undefined){
          for(let dog in user['user'].dogs){
            let c:Cachorro = user['user'].dogs[dog];
            c.name = dog;
            this.usuarioAuth.dogs.push(c);
          }
        }

      },
      ()=>{
      });

        
  }

}
