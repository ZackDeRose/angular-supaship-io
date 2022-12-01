import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { supaClient } from '../supa-client';
import { UserData, UserService } from '../user.service';

@Component({
  selector: 'angular-supaship-create-comment-form',
  templateUrl: './create-comment-form.component.html',
  styleUrls: ['./create-comment-form.component.scss'],
})
export class CreateCommentFormComponent {
  constructor(public userService: UserService) {}
  @Input() postCommentingOn?: { path: string; id: string };
  @Input() allowCancel = true;
  @Output() commentSubmitted = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  form = new FormControl('');
  async submitComment(userData: UserData) {
    await supaClient.rpc('create_new_comment', {
      content: this.form.value || '',
      path: `${
        this.postCommentingOn?.path
      }.${this.postCommentingOn?.id.replaceAll('-', '_')}`,
      user_id: userData.user?.id || '',
    });
    this.commentSubmitted.emit();
    this.form.reset();
  }
}
