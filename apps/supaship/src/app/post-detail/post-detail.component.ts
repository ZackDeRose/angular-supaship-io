import { Component, OnInit } from '@angular/core';
import { EventType, NavigationEnd, Router } from '@angular/router';
import {
  filter,
  map,
  merge,
  Observable,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { supaClient } from '../supa-client';
import { UserService } from '../user.service';

export interface Post {
  id: string;
  author_name: string;
  title: string;
  content: string;
  score: number;
  created_at: string;
  path: string;
  comments: Comment[];
}

interface GetPostResponse {
  id: string;
  author_name: string;
  created_at: string;
  title: string;
  content: string;
  score: number;
  path: string;
}

export interface Comment {
  id: string;
  author_name: string;
  content: string;
  score: number;
  created_at: string;
  path: string;
  depth: number;
  comments: Comment[];
}

export type FlatComment = Omit<Comment, 'comments'> & { depth: number };

interface PostDetailData {
  post: Post | null;
  comments: FlatComment[];
  myVotes?: Record<string, 'up' | 'down' | undefined>;
}

@Component({
  selector: 'angular-supaship-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  #commentSubmitted = new Subject<void>();
  constructor(public router: Router, public userService: UserService) {}
  postData$: Observable<PostDetailData> = merge(
    this.router.events.pipe(
      filter(
        (val: any): val is NavigationEnd => val.type === EventType.NavigationEnd
      ),
      startWith(undefined)
    ),
    this.#commentSubmitted
  ).pipe(
    switchMap(
      () =>
        supaClient
          .rpc('get_single_post_with_comments', {
            post_id: this.router.url.replace('/post/', ''),
          })
          .select('*')
          .then(({ data }) => data) as Promise<GetPostResponse[]>
    ),
    map((array) => ({
      post: {
        ...array[0],
        comments: unsortedCommentsToNested(
          array.splice(1).map((getPostResponse) => ({
            ...getPostResponse,
            depth: getDepth(getPostResponse.path),
          }))
        ),
      },
      comments: [] as any,
    }))
  );
  observedCommentSubmitted() {
    this.#commentSubmitted.next();
  }

  ngOnInit() {
    this.userService.refetchUserVotes();
  }
}

function unsortedCommentsToNested(comments: FlatComment[]): Comment[] {
  const commentMap = comments.reduce((acc, comment) => {
    acc[comment.id] = {
      ...comment,
      comments: [],
      depth: getDepth(comment.path),
    };
    return acc;
  }, {} as Record<string, Comment & { depth: number }>);
  const result: Comment[] = [];
  const sortedByDepthThenCreationTime = [...Object.values(commentMap)].sort(
    (a, b) =>
      a.depth > b.depth
        ? 1
        : a.depth < b.depth
        ? -1
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  for (const post of sortedByDepthThenCreationTime) {
    if (post.depth === 1) {
      result.push(post);
    } else {
      const parentNode = getParent(commentMap, post.path);
      parentNode.comments.push(post);
    }
  }
  return result;
}

function getParent(map: Record<string, Comment>, path: string): Comment {
  const parentId = path.replace('root.', '').split('.').slice(-1)[0];
  const parent = map[convertToUuid(parentId)];
  if (!parent) {
    throw new Error(`Parent not found at ${parentId}`);
  }
  return parent;
}

function convertToUuid(path: string): string {
  return path.replaceAll('_', '-');
}

function getDepth(path: string): number {
  const rootless = path.replace('.', '');
  return rootless.split('.').filter((x) => !!x).length;
}
