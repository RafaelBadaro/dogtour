import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpClient } from '@angular/common/http';
import { constantes } from '../constantes';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: "app-avaliacao-dono",
  templateUrl: "./avaliacao-dono.component.html",
  styleUrls: ["./avaliacao-dono.component.scss"]
})
export class AvaliacaoDonoComponent implements OnInit {
  constructor(public authService: AuthService,
    private http: HttpClient,
    private loadingService: LoadingService,
    private alertService: AlertService) { }

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
    if (this.authService.usuarioDono) {
      this.notaPasseador = 1;
    } else {
      this.notaCachorro = 1;
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
    if (this.authService.usuarioDono) {
      this.notaPasseador = 2;
    } else {
      this.notaCachorro = 2;
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
    if (this.authService.usuarioDono) {
      this.notaPasseador = 3;
    } else {
      this.notaCachorro = 3;
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
    if (this.authService.usuarioDono) {
      this.notaPasseador = 4;
    } else {
      this.notaCachorro = 4;
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
    if (this.authService.usuarioDono) {
      this.notaPasseador = 5;
    } else {
      this.notaCachorro = 5;
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
    this.loadingService.mostrarLoading();

    console.log("nota do cachorro: " + this.notaCachorro);
    console.log("nota do dono: " + this.notaDono);
    console.log("nota do passeador: " + this.notaPasseador);


    if (this.authService.usuarioDono) {
      const body = {
        user_id: this.authService.usuarioAuth.tourCompletado.walker_id,
        rating: this.notaPasseador
      };
      this.http.post(constantes.textos.URL_API + '/api/user/rate', body,
        { headers: { 'Content-Type': 'text/plain' } }).subscribe(
          () => {
            this.loadingService.fecharLoading();
          },
          () => {
            this.loadingService.fecharLoading();
          }
        );
    } else {
      // TODO - COLOCAR PRA AVALIAR O CACHORRO TB
      const body = {
        user_id: this.authService.usuarioAuth.tourCompletado.owner_id,
        rating: this.notaDono
      };
      this.http.post(constantes.textos.URL_API + '/api/user/rate', body,
        { headers: { 'Content-Type': 'text/plain' } }).subscribe(
          () => {
            this.loadingService.fecharLoading();
          },
          () => {
            this.loadingService.fecharLoading();
          }
        );
    }

  }
  ngOnInit() { }
}
