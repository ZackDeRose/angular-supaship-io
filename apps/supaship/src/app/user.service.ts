import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import {
  BehaviorSubject,
  bufferCount,
  filter,
  Observable,
  Observer,
  share,
} from 'rxjs';
import { supaClient } from './supa-client';

export interface UserData {
  initialized: boolean;
  doneCheckForProfile: boolean;
  user?: User;
  profile?: { username?: string };
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #user$ = new BehaviorSubject<UserData>({
    user: undefined,
    profile: undefined,
    initialized: false,
    doneCheckForProfile: false,
  });
  user$: Observable<UserData> = this.#user$.asObservable();

  constructor(private router: Router) {
    supaClient.auth.getUser().then(({ data: { user }, error }) => {
      if (user && !error) {
        this.#user$.next({
          user,
          profile: {},
          initialized: true,
          doneCheckForProfile: false,
        });
      } else {
        this.#user$.next({
          user: undefined,
          profile: undefined,
          initialized: true,
          doneCheckForProfile: false,
        });
      }
      supaClient.auth.onAuthStateChange((_event, session) => {
        this.#user$.next({
          user: session?.user,
          profile: {},
          initialized: true,
          doneCheckForProfile: this.#user$.value.doneCheckForProfile,
        });
      });
    });
    this.#user$
      .pipe(
        bufferCount(2, 1),
        filter(([prev, curr]) => !prev.user && !!curr.user)
      )
      .subscribe(([_prev, { user }]) => {
        supaClient
          .from('user_profiles')
          .select('*')
          .eq('user_id', user?.id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              this.#user$.next({
                user: user,
                profile: { username: data.username },
                initialized: true,
                doneCheckForProfile: true,
              });
              supaClient
                .channel('user_profile')
                .on(
                  'postgres_changes',
                  {
                    event: '*',
                    schema: 'public',
                    table: 'user_profiles',
                    filter: `user_id=eq.${user?.id}`,
                  },
                  (payload) => {
                    this.#user$.next({
                      user,
                      profile: {
                        username: (payload.new as { username: string })
                          .username,
                      },
                      initialized: true,
                      doneCheckForProfile: true,
                    });
                  }
                )
                .subscribe();
            } else {
              this.#user$.next({
                ...this.#user$.value,
                doneCheckForProfile: true,
              });
              this.router.navigateByUrl('/welcome');
            }
          });
      });
  }
}
