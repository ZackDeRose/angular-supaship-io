import { inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter, map } from 'rxjs';
import { AllPostsComponent } from './all-posts/all-posts.component';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { LoginComponent } from './login/login.component';
import { MessageBoardComponent } from './message-board/message-board.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { UserService } from './user.service';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageBoardComponent,
    AllPostsComponent,
    PostDetailComponent,
    WelcomeComponent,
    LoginComponent,
    DialogComponent,
    UserMenuComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'welcome',
        component: WelcomeComponent,
        canActivate: [
          () => {
            const userService = inject(UserService);
            return userService.user$.pipe(
              filter(
                ({ initialized, user, doneCheckForProfile }) =>
                  doneCheckForProfile || (initialized && !user)
              ),
              map(({ user, profile }) => !!(user && !profile?.username))
            );
          },
        ],
      },
      {
        path: '',
        component: MessageBoardComponent,
        canActivate: [
          () => {
            const userService = inject(UserService);
            return userService.user$.pipe(
              map(({ user, profile }) => {
                return !user || profile?.username ? true : '/welcome';
              })
            );
          },
        ],
        children: [
          {
            path: ':pageNumber',
            component: AllPostsComponent,
          },
          { path: 'post/:postId', component: PostDetailComponent },
        ],
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
