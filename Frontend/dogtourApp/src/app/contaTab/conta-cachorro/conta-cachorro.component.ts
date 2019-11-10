import { Component, OnInit, Input} from '@angular/core';
import { Cachorro } from 'src/app/models/cachorro.model';

@Component({
  selector: 'app-conta-cachorro',
  templateUrl: './conta-cachorro.component.html',
  styleUrls: ['./conta-cachorro.component.scss'],
})
export class ContaCachorroComponent {

  @Input() dog: Cachorro;


  constructor() { }

}
