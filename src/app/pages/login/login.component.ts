import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel = new UserModel();
  remindMe = false;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.remindMe = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Por favor espere...'
    });

    Swal.showLoading();

    this.authService.login(this.user)
      .subscribe(res => {
        Swal.close();
        if (this.remindMe) {
          localStorage.setItem('email', this.user.email);
        }
        this.router.navigateByUrl('/home');
      }, (err) => {
        Swal.fire({
          title: 'Error al autenticar',
          icon: 'error',
          text: err.error.error.message
        });
      });
  }

}
