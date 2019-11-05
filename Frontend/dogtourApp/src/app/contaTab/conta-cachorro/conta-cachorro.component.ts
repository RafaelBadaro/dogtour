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
  @Output() dogAtualizadoEmitter = new EventEmitter();

  formDog: FormGroup;

  dogName = new FormControl({value: '', disabled: true});

  sex = new FormControl({value: '', disabled: true});

  size = new FormControl({value: '', disabled: true});

  temper = new FormControl({value: '', disabled: true});


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formDog = this.formBuilder.group({
      dogName: this.dogName,
      sex: this.sex,
      size: this.size,
      temper: this.temper
    });
    this.dogName.setValue(this.dog.name);
    this.sex.setValue(this.dog.sex);
    this.size.setValue(this.dog.size);
    this.temper.setValue(this.dog.temper);
  }

  enviarAlteracoes() {
    this.dogAtualizadoEmitter.emit(this.formDog.value);
  }

}
