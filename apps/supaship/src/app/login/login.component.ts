import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, map } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { supaClient } from '../supa-client';
import { UserService } from '../user.service';

@Component({
  selector: 'angular-supaship-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoggedId$ = this.userService.user$.pipe(map(({ user }) => !!user));
  loginType?: 'sign_up' | 'login';
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  @ViewChild('dialog', { static: true }) dialogComponent!: DialogComponent;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.dialogComponent.dialogStateChange
      .pipe(filter((newState) => newState === false))
      .subscribe(() => {
        this.loginType = undefined;
        this.form.reset();
      });
  }

  async submit() {
    if (this.loginType === 'login') {
      const { data, error } = await supaClient.auth.signInWithPassword({
        email: this.form.get('email')?.value as string,
        password: this.form.get('password')?.value as string,
      });
      if (data && !error) {
        this.loginType = undefined;
      }
    } else if (this.loginType === 'sign_up') {
      const { data, error } = await supaClient.auth.signUp({
        email: this.form.get('email')?.value as string,
        password: this.form.get('password')?.value as string,
      });
      if (data && !error) {
        this.loginType = undefined;
      }
    }
  }

  loginClick() {
    this.loginType = 'login';
  }

  signUpClick() {
    this.loginType = 'sign_up';
  }
}
