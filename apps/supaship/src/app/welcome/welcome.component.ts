import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { supaClient } from '../supa-client';
import { UserService } from '../user.service';

@Component({
  selector: 'angular-supaship-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  control = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(15),
    Validators.pattern(/^[a-zA-Z0-9_]+$/),
  ]);
  serverError = false;

  constructor(private userService: UserService, private router: Router) {}

  async submit() {
    const userData = await firstValueFrom(this.userService.user$);
    if (!userData.user) {
      return;
    }
    const { error } = await supaClient.from('user_profiles').insert({
      user_id: userData.user.id,
      username: this.control.value as string,
    });
    if (!error) {
      this.router.navigateByUrl('/1');
    } else {
      this.serverError = true;
    }
  }
}
