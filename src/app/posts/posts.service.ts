import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { Post } from "./post.model";
import { map } from 'rxjs/operators'
import { Router } from "@angular/router";



@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.body,
            id:post.id
            // image: post.image
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{id: string, title: string, content: string}>(`http://localhost:3000/api/posts?id=${id} `)
  }

  //, image: File
  addPost(id: string, title: string, content: string) {
    // const postData = new FormData();
    // postData.append('id', id);
    // postData.append('title', title);
    // postData.append('content', content);
    //console.log(id,title,content);
    var user={
      id:id,
      title:title,
      content:content
    }
    console.log(user)
    // postData.append('image', image.name);
    // console.log(image,title)
    this.http
      .post<{message: string; post: Post}>('http://localhost:3000/api/posts', user)
      .subscribe((responseData) => {
        // const post: Post = { id, title, content }//, image: responseData.post.image
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"])
      })

  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content}//, image: null
    const url=`http://localhost:3000/api/posts?id=${id}&title=${title}&content=${content}`

    this.http.put(url, post)
      .subscribe(() => {
        const updatedPosts = [...this.posts]
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id)
        updatedPosts[oldPostIndex] = post
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
        this.router.navigate(['/'])
      })
  }

  deletePost(postId: string) {
    // console.log(postId)
    const url=`http://localhost:3000/api/posts?id=${postId}`
    this.http.delete(url)
      .subscribe(() => {

        const updatedPosts = this.posts.filter(post => post.id != postId)
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
      })
  }
}
