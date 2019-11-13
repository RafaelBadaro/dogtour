import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Horario } from 'src/app/models/horario.model';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss'],
})
export class HorarioComponent implements OnInit {

  @Input() horario: Horario;

  constructor() { }

  ngOnInit() {}


}
