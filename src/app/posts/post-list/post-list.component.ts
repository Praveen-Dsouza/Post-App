import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false
  // totalPosts = 10
  // postsPerPage = 2
  // currentPage =1
  // pageSizeOptions = [1, 2, 5 ,10]
  userIsAuthenticated = false
  private postsSub: Subscription;
  private authStatusSubs: Subscription

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false
        this.posts = posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated
      })
  }

  // onChangedPage(pageData: PageEvent) {
  //   this.currentPage = pageData.pageIndex + 1
  //   this.postsPerPage = pageData.pageSize
  //   this.postsService.getPosts();

  // }

  onDelete(postId: string) {
    // console.log(postId)
    try {
      this.postsService.deletePost(postId)
    } catch {
      this.isLoading = false
    }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}
