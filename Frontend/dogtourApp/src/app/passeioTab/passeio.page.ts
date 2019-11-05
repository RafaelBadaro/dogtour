import { Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-passeio',
  templateUrl: 'passeio.page.html',
  styleUrls: ['passeio.page.scss']
})
export class PasseioPage {

  constructor(private loadingService: LoadingService) { }

  public agendar() {

  }

  public pedirAgora() {

  }

}
