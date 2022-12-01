import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../post-detail/post-detail.component';
import { UserService } from '../user.service';

@Component({
  selector: 'angular-supaship-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Output() commentSubmitted = new EventEmitter<void>();
  isCommenting = false;

  constructor(public userService: UserService) {}
}
