import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/usuario.model';
@Component({
  selector: 'app-avaliacao-dono',
  templateUrl: './avaliacao-dono.component.html',
  styleUrls: ['./avaliacao-dono.component.scss']
})
export class AvaliacaoDonoComponent implements OnInit {
  constructor(public authService: AuthService) {}

  notaCachorro = 0;
  notaDono = 0;
  notaPasseador = 0;

  zipped1: boolean = true;
  zipped2: boolean = true;
  zipped3: boolean = true;
  zipped4: boolean = true;
  zipped5: boolean = true;
  zipped6: boolean = true;
  zipped7: boolean = true;
  zipped8: boolean = true;
  zipped9: boolean = true;
  zipped10: boolean = true;
  toggleZipped1(): void {
    if (this.zipped1 == true) {
      this.zipped1 = !this.zipped1;
    }
    this.zipped2 = !this.zipped1;
    this.zipped3 = !this.zipped1;
    this.zipped4 = !this.zipped1;
    this.zipped5 = !this.zipped1;
    if (this.authService.usuarioPasseador) {
      this.notaCachorro = 1;
    } else {
      this.notaPasseador = 1;
    }
  }
  toggleZipped6(): void {
    if (this.zipped6 == true) {
      this.zipped6 = !this.zipped6;
    }
    this.zipped7 = !this.zipped6;
    this.zipped8 = !this.zipped6;
    this.zipped9 = !this.zipped6;
    this.zipped10 = !this.zipped6;
    this.notaDono = 1;
  }
  toggleZipped2(): void {
    if (this.zipped2 == true) {
      this.zipped2 = !this.zipped2;
      this.zipped1 = this.zipped2;
    }
    this.zipped3 = true;
    this.zipped4 = true;
    this.zipped5 = true;
    if (this.authService.usuarioPasseador) {
      this.notaCachorro = 2;
    } else {
      this.notaPasseador = 2;
    }
  }
  toggleZipped7(): void {
    if (this.zipped7 == true) {
      this.zipped7 = !this.zipped7;
      this.zipped6 = this.zipped7;
    }
    this.zipped8 = true;
    this.zipped9 = true;
    this.zipped10 = true;
    this.notaDono = 2;
  }
  toggleZipped3(): void {
    if (this.zipped3 == true) {
      this.zipped3 = !this.zipped3;
      this.zipped2 = this.zipped3;
      this.zipped1 = this.zipped3;
    }
    this.zipped4 = true;
    this.zipped5 = true;
    if (this.authService.usuarioPasseador) {
      this.notaCachorro = 3;
    } else {
      this.notaPasseador = 3;
    }
  }
  toggleZipped8(): void {
    if (this.zipped8 == true) {
      this.zipped8 = !this.zipped8;
      this.zipped6 = this.zipped8;
      this.zipped7 = this.zipped8;
    }
    this.zipped9 = true;
    this.zipped10 = true;
    this.notaDono = 3;
  }
  toggleZipped4(): void {
    if (this.zipped4 == true) {
      this.zipped4 = !this.zipped4;
      this.zipped1 = this.zipped4;
      this.zipped2 = this.zipped4;
      this.zipped3 = this.zipped4;
    }
    this.zipped5 = true;
    if (this.authService.usuarioPasseador) {
      this.notaCachorro = 4;
    } else {
      this.notaPasseador = 4;
    }
  }
  toggleZipped9(): void {
    if (this.zipped9 == true) {
      this.zipped9 = !this.zipped9;
      this.zipped6 = this.zipped9;
      this.zipped7 = this.zipped9;
      this.zipped8 = this.zipped9;
    }
    this.zipped10 = true;
    this.notaDono = 4;
  }
  toggleZipped5(): void {
    this.zipped5 = !this.zipped5;
    this.zipped1 = this.zipped5;
    this.zipped2 = this.zipped5;
    this.zipped3 = this.zipped5;
    this.zipped4 = this.zipped5;
    if (this.authService.usuarioPasseador) {
      this.notaCachorro = 5;
    } else {
      this.notaPasseador = 5;
    }
  }
  toggleZipped10(): void {
    this.zipped10 = !this.zipped10;
    this.zipped9 = this.zipped10;
    this.zipped8 = this.zipped10;
    this.zipped7 = this.zipped10;
    this.zipped6 = this.zipped10;
    this.notaDono = 5;
  }
  teste(): void {
    if (this.authService.usuarioPasseador) {
      console.log('nota do cachorro: ' + this.notaCachorro);
      console.log('nota do dono: ' + this.notaDono);
    } else {
      console.log('nota do passeador: ' + this.notaPasseador);
    }
  }
  ngOnInit() {}
}
