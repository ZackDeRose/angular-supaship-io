import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'angular-supaship-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.scss'],
})
export class MessageBoardComponent {
  constructor(public userService: UserService) {}
}
