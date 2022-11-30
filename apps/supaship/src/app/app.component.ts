import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData, UserService } from './user.service';

@Component({
  selector: 'angular-supaship-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user$: Observable<UserData> = this.userService.user$;
  constructor(public userService: UserService) {}
}
