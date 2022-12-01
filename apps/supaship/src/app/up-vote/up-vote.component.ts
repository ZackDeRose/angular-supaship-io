import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { supaClient } from '../supa-client';
import { UserService } from '../user.service';

@Component({
  selector: 'angular-supaship-up-vote',
  templateUrl: './up-vote.component.html',
  styleUrls: ['./up-vote.component.scss'],
})
export class UpVoteComponent implements OnInit {
  @Input() post!: { id: string; score: number };
  @Output() voteCast = new EventEmitter<void>();
  filled$?: Observable<'up' | 'down' | 'no vote'>;
  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.filled$ = this.userService.user$.pipe(
      map(({ votes }) => votes?.[this.post.id] || 'no vote')
    );
  }

  async voteClick(type: 'up' | 'down', userId: string) {
    await supaClient.from('post_votes').upsert(
      {
        post_id: this.post.id,
        user_id: userId,
        vote_type: type,
      },
      { onConflict: 'post_id,user_id' }
    );
    this.userService.refetchUserVotes();
    this.voteCast.emit();
  }
}
