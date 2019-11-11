import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-passeio-encontrado',
  templateUrl: './passeio-encontrado.component.html',
  styleUrls: ['./passeio-encontrado.component.scss'],
})
export class PasseioEncontradoComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {}


  public cancelar() {

  }
}
