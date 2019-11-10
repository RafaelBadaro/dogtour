import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Cachorro } from 'src/app/models/cachorro.model';

@Component({
  selector: 'app-conta-cachorro',
  templateUrl: './conta-cachorro.component.html',
  styleUrls: ['./conta-cachorro.component.scss'],
})
export class ContaCachorroComponent implements OnInit {

  @Input() dog: Cachorro;


  constructor() { }

  ngOnInit() {
  }

  enviarAlteracoes() {
  }

}
