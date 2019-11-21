import { Component, OnInit, Input } from '@angular/core';
import { Tour } from 'src/app/models/tour.model';
import { HttpClient } from '@angular/common/http';
import { constantes } from 'src/app/constantes';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-passeio-agenda',
  templateUrl: './passeio-agenda.component.html',
  styleUrls: ['./passeio-agenda.component.scss'],
})
export class PasseioAgendaComponent implements OnInit {

  @Input() tour: Tour;

  passeioConfirmado = false;

  passeioCancelado = false;

  decisaoFeita = false;

  constructor(private http: HttpClient,
              private loadingService: LoadingService, private alertService: AlertService) { }

  ngOnInit() {
    if (this.tour.status === '1') {
      this.decisaoFeita = true;
      this.passeioConfirmado = true;
    }
    if (this.tour.status === '3') {
      this.decisaoFeita = true;
      this.passeioCancelado = true;
    }

  }

  confirmarPasseio() {
    this.loadingService.mostrarLoading();
    this.decisaoFeita = true;
    this.passeioConfirmado = true;

    const body = {
      tour_id: this.tour.tour_id,
      status: '1'
    };

    this.http.post(constantes.textos.URL_API + '/api/tour/update', body,
      { headers: { 'Content-Type': 'text/plain' } }).subscribe(
        () => {
          this.loadingService.fecharLoading();
          this.alertService.abrirAlert(constantes.textos.sucesso.TXT_SUCESSO, 'Tour confirmado com sucesso');
        },
        () => {
          this.loadingService.fecharLoading();
        }
      );
  }

  cancelarPasseio() {
    this.loadingService.mostrarLoading();
    this.decisaoFeita = true;
    this.passeioCancelado = true;

    const body = {
      tour_id: this.tour.tour_id,
      status: '3'
    };

    this.http.post(constantes.textos.URL_API + '/api/tour/update', body,
      { headers: { 'Content-Type': 'text/plain' } }).subscribe(
        () => {
          this.loadingService.fecharLoading();
          this.alertService.abrirAlert(constantes.textos.sucesso.TXT_SUCESSO, 'Tour cancelado com sucesso');
        },
        () => {
          this.loadingService.fecharLoading();
        }
      );

  }

}
