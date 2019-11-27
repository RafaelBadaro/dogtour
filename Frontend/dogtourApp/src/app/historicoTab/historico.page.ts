import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { constantes } from '../constantes';
import { Tour } from '../models/tour.model';

@Component({
  selector: 'app-historico',
  templateUrl: 'historico.page.html',
  styleUrls: ['historico.page.scss']
})
export class HistoricoPage implements OnInit {

  toursCompletados: Tour[] = [];

  constructor(public authService: AuthService,
    private http: HttpClient, private router: Router) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/tabs/historicoTab') {
          this.ngOnInit();
        }
      }
    });

  }

  ngOnInit(): void {

    if (this.authService.usuarioAuth.idUser !== undefined) {
      this.http.get(constantes.textos.URL_API + '/api/user/' + this.authService.getToken() + '/tours/' + '2').subscribe(
        (res: any) => {
          if (res.tours !== undefined) {
            // tslint:disable-next-line: forin
            for (const tour in res.tours) {
              const tourCompletado = new Tour();
              tourCompletado.tour_id = tour;
              tourCompletado.day = res.tours[tour].day;
              tourCompletado.latitude = res.tours[tour].latitude;
              tourCompletado.longitude = res.tours[tour].longitude;
              tourCompletado.owner_id = res.tours[tour].owner.user_id;
              tourCompletado.ownerName = res.tours[tour].owner.name;
              tourCompletado.dogName = res.tours[tour].dog.name;
              tourCompletado.status = res.tours[tour].status;
              tourCompletado.time = res.tours[tour].time;
              tourCompletado.walker_id = res.tours[tour].walker.user_id;
              tourCompletado.walkerName = res.tours[tour].walker.name;
              const jaExiste = this.toursCompletados.find((ta) => {
                return ta.day === tourCompletado.day && ta.time === tourCompletado.time;
              });

              if (jaExiste === undefined) {
                this.toursCompletados.push(tourCompletado);
              }
            }
          }
        },
        () => {

        }
      );
    } else {
      this.router.navigate(['/login']);
    }


  }

  public irTelaAvaliacao(tour: Tour) {
    this.authService.usuarioAuth.tourCompletado = tour;
    this.router.navigate(['/avaliacao-dono']);
  }


}
