import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Horario } from 'src/app/models/horario.model';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss'],
})
export class HorarioComponent implements OnInit {

  @Input() horario: Horario;
  @Input() listaHorarios: Horario[];
  @Output() listaAtualizada = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  public removeItemLista() {
    const horaNaLista = this.listaHorarios.find((h) => h.id === this.horario.id);
    const index = this.listaHorarios.indexOf(horaNaLista);
    this.listaHorarios.splice(index, 1);
    this.listaAtualizada.emit(this.listaHorarios);
  }

}
