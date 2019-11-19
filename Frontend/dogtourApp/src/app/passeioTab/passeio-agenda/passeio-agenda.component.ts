import { Component, OnInit, Input } from '@angular/core';
import { Tour } from 'src/app/models/tour.model';

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

  constructor() { }

  ngOnInit() {}

  confirmarPasseio(){
    this.decisaoFeita = true;
    this.passeioConfirmado = true;
  }

  cancelarPasseio(){
    this.decisaoFeita = true;
    this.passeioCancelado = true;
  }

}
