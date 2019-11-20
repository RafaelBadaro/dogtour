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
            for (const tour in res.tours) {
              if (res.tours[tour].status === '0' && res.tours[tour].walker_id !== '') {
                const tourCompletado = new Tour();
                tourCompletado.day = res.tours[tour].day;
                tourCompletado.dog_id = res.tours[tour].dog_id;
                tourCompletado.latitude = res.tours[tour].latitude;
                tourCompletado.longitude = res.tours[tour].longitude;
                tourCompletado.owner_id = res.tours[tour].owner_id;
                tourCompletado.status = res.tours[tour].status;
                tourCompletado.time = res.tours[tour].time;
                tourCompletado.walker_id = res.tours[tour].walker_id;
                const jaExiste = this.toursCompletados.find((ta) => {
                  return ta.day === tourCompletado.day && ta.time === tourCompletado.time;
                });

                if (jaExiste === undefined) {
                  this.toursCompletados.push(tourCompletado);
                }
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

  public irTelaAvaliacao(){
    this.router.navigate(['/avaliacao-dono']);
  }


}
