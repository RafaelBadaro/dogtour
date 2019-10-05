import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro-cachorro.component.html',
  styleUrls: ['./cadastro-cachorro.component.scss']
})
export class CadastroCachorroComponent implements OnInit {
  formCadastroCachorro: FormGroup;

  name = new FormControl('', Validators.required);

  size = new FormControl('', Validators.required);

  temper = new FormControl('', Validators.required);

  gener = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.formCadastroCachorro = this.formBuilder.group({
      name: this.name,
      size: this.size,
      temper: this.temper,
      gener: this.gener
    });
  }

  realizarCadastroCachorro() {
    //TODO mudar essa rota
    this.http.post('localhost:8000/user', this.formCadastroCachorro.value).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('finalizei');
      }
    );
  }
}
