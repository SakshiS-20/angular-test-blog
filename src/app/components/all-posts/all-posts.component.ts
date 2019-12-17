import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../services/post.service';
import { switchMap} from 'rxjs/operators';
import { Subscription, timer, pipe} from 'rxjs';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss']
})
export class AllPostsComponent implements OnInit, OnDestroy {

  posts = [];
  metaData: any = {
    totalPages: 1,
    currentPage: 0
  };
  serviceSubscription: Subscription;
  originalData = [];
  searchInput: string;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getAllPosts();
  }

  getAllPosts() {
    if (this.checkPage()) {
     this.serviceSubscription = timer(0, 10000).pipe(switchMap(() => this.postService.getAllPosts(this.metaData.currentPage)))
      .subscribe(
        (res: any) => {
          this.originalData.push(...res.hits);
          this.search();
          this.updateMeta();
         },
        error => { console.log(error); }
      );
    }
  }

  updateMeta() {
    this.metaData.currentPage++;
  }

  checkPage() {
    return this.metaData.totalPages > this.metaData.currentPage;
  }

  search() {
    if (!this.searchInput) {
      this.posts = this.originalData;
    } else {
      this.posts = this.originalData.filter(post => post.title.toLowerCase().includes(this.searchInput.toLowerCase()));
    }
  }

  resetSearch() {
    this.posts = this.originalData;
    this.searchInput = null;
  }

  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
}
