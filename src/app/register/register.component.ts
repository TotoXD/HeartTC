import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../service/auth-service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  usersReceived: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) { }

  registerForm = this.formBuilder.group({
    mailAddress: '',
    pseudo: '',
    password: '',
  });

  ngOnInit(): void {
  }


  // Fonction permettant d'enregistrer l'utilisateur
  register(): void {
    var formData = this.registerForm.value;

    this.userService.addUser(formData.mailAddress, formData.pseudo, formData.password).subscribe(() => {
      console.warn('Your order has been submitted', this.registerForm.value);
      this.registerForm.reset();
      this.router.navigate(['/login']);
    });
  }

  clickMenu() {
    this.router.navigateByUrl('');
  }

  login() {
    this.router.navigateByUrl('/login');
  }
}
