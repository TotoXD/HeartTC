import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { UserService } from '../service/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authStatus: boolean;

  constructor(private router: Router, private authService: AuthService, private userService: UserService, private formBuilder: FormBuilder) { }

  loginForm = this.formBuilder.group({
    mailAddress: '',
    password: '',
  });

  ngOnInit() {
  }

  login() {
    var formData = this.loginForm.value;
    this.userService.login(formData.mailAddress, formData.password).subscribe((token: any) => {
      // token.token : l'attribut token dans le token (json)
      this.authService.token = token.token;

      this.router.navigateByUrl('/lobby');
    });
  }

  clickMenu() {
    this.router.navigateByUrl('');
  }

  clickInscription() {
    this.router.navigateByUrl('/register');
  }
}
