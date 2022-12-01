import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { supaClient } from '../supa-client';
import { UserData, UserService } from '../user.service';

interface PostData {
  id: string;
  title: string;
  score: number;
  username: string;
  user_id: string;
}

interface GetPostsResponse {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  score: number;
  username: string;
}

@Component({
  selector: 'angular-supaship-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit {
  constructor(public userService: UserService) {}

  fetchEvents = new BehaviorSubject<void>(undefined);
  allPosts$: Observable<PostData[]> = this.fetchEvents.pipe(
    switchMap(() => {
      return supaClient
        .rpc('get_posts', { page_number: 1 })
        .select('*')
        .then(({ data }) => data) as Promise<GetPostsResponse[]>;
    })
  );
  newPostForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    contents: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.userService.refetchUserVotes();
  }

  async submitNewPost(userData: UserData) {
    await supaClient.rpc('create_new_post', {
      userId: userData.user?.id || '',
      content: this.newPostForm.get('contents')?.value || '',
      title: this.newPostForm.get('title')?.value || '',
    });
    this.newPostForm.reset();
    this.fetchEvents.next();
  }
}
