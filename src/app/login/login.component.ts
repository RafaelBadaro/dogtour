import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  formLogin: FormGroup;
  
  email = new FormControl('',Validators.required);

  senha = new FormControl('',Validators.required);

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit() {

    this.formLogin = this.formBuilder.group({
      email: this.email,
      senha: this.senha,
    });
   }

  realizarLogin() {
    this.http.post('localhost:8000/user/login', this.formLogin).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/tabs/passeioTab']);
      },
      (err) => {
        console.log(err);
      },
      ()=>{
        console.log('finalizei');
      }
    );
  }


}
