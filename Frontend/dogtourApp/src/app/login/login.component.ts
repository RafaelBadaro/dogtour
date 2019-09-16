import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  formLogin: FormGroup;
  
  email = new FormControl('',Validators.required);

  senha = new FormControl('',Validators.required);

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {

    this.formLogin = this.formBuilder.group({
      email: this.email,
      senha: this.senha,
    });
   }

  realizarLogin() {
    console.log("cliquei")
  }


}
