import { Usuario } from '../models/usuario.model';
import { Injectable } from '@angular/core';
import { SettingsProvider } from '../settings-provider';
import * as jwtDecode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private settingsProvider: SettingsProvider) { }

  public usuarioAuth: Usuario = new Usuario();

  private config = this.settingsProvider.getConfiguration;

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    if(token !== null && token.length > 0){
      const decoded = this.getDecodedToken(token);
      if(decoded !== null){
        if(decoded.iss === this.config.iss){
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
  }

  private getDecodedToken(token: string){
    const decoded = jwtDecode(token);
    return decoded;
  }
}
