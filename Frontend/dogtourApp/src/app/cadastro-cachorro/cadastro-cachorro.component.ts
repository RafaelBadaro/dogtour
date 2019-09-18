import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro-cachorro.component.html',
  styleUrls: ['./cadastro-cachorro.component.scss']
})
export class CadastroCachorroComponent implements OnInit {
  formCadastro: FormGroup;

  name = new FormControl('', Validators.required);

  size = new FormControl('', Validators.required);

  temper = new FormControl('', Validators.required);

  gener = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.formCadastro = this.formBuilder.group({
      name: this.name,
      size: this.size,
      temper: this.temper,
      gener: this.gener
    });
  }

  realizarCadastro() {
    this.http.post('localhost:8000/user', this.formCadastro.value).subscribe(
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
