import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // TODO - MUDAR PARA RECEBER A TOKEN
  isLoggedIn(): boolean {
    return true;
  }
}
