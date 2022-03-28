import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/post.service';
import { FormattedComment } from '../post.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment: FormattedComment | undefined;
  @Input() author: boolean = false;
  @Input() commentID: string = '';
  isEditing = false;
  editedComment = new FormControl('', [Validators.required, Validators.maxLength(500)]);

  constructor(private postService: PostService, private route: ActivatedRoute) { }

  toggleEditing(state: boolean) {
    this.isEditing = state;
    if (state) {
      this.editedComment.patchValue(this.comment?.text);
    }
  }

  edit() {
    const postID = this.route.snapshot.params['id'];
    this.postService.editComment(postID, this.commentID, this.editedComment.value);
  }

  delete() {
    const postID = this.route.snapshot.params['id'];
    if (confirm('Вы уверены, что хотите удалить этот комментарий?')) 
      this.postService.deleteComment(postID, this.commentID);
  }
}
