import { Component } from '@angular/core';
import { supaClient } from '../supa-client';
import { UserService } from '../user.service';

@Component({
  selector: 'angular-supaship-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  constructor(public userService: UserService) {}

  logout() {
    supaClient.auth.signOut();
  }
}
