import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  formLogin: FormGroup;
  email = new FormControl(null);

  senha = new FormControl(null);

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.formLogin = this.formBuilder.group({
      email: this.email,
      senha: this.senha,
    });
   }

  realizarLogin() {

  }

}
