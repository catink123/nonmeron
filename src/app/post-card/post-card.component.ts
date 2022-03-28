import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  @Input() id = '';
  image = '';
  imageLoading = true;
  @Input() title = 'Загрузка...';
  constructor(private router: Router, private postService: PostService) { }

  async ngOnInit() {
    const onFail = (reason?: any) => {
      if (reason) console.log("Couldn't load the image with reason:", reason);
      this.image = '/assets/unknown.svg';
      this.imageLoading = false;
    };
    try {
      await this.postService
        .getThumbnailImage(this.id)
        .getDownloadURL()
        .subscribe(url => {
          this.image = url;
          this.imageLoading = false;
        }, onFail);
      /* const imagesRef = await this.postService.getImages(this.id);
      imagesRef.listAll().subscribe(listResult => {
        if (listResult.items.length === 0) onFail();
        listResult
          .items
          .filter(val => val.name === 'thumbnail.jpg')[0]
          .getDownloadURL()
          .then(url => {
            this.image = url;
            this.imageLoading = false;
          })
          .catch(onFail);
      }); */
    } catch (reason) {
      console.error("Couldn't get images with reason:", reason);
      onFail();
    }
  }

  open() {
    this.router.navigate(['post', this.id]);
  }
}
