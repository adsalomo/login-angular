import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  user: UserModel;
  remindMe = false;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.user = new UserModel();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Por favor espere...'
    });

    Swal.showLoading();

    this.authService.signIn(this.user).subscribe(resp => {
      Swal.close();
      if (this.remindMe) {
        localStorage.setItem('email', this.user.email);
      }
      this.router.navigateByUrl('/home');
    }, err => {
      Swal.fire({
        title: 'Error al autenticar',
        icon: 'error',
        text: err.error.error.message
      });
    });
  }


}
