import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { AuthService } from 'src/app/auth.service';
import { ImageResizer } from 'src/app/lib/ImageResizer';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  addPostForm = this.fb.group({
    id: ['', Validators.required],
    title: [''],
    description: [''],
    imageFile: [null, Validators.required],
    tags: ['', Validators.required]
  });
  hasPosted = false;
  error = '';

  isUploading = false;
  fullImageProgress = 0;
  thumbnailImageProgress = 0;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private adminService: AdminService,
    private analytics: AngularFireAnalytics,
    private title: Title
  ) {
    title.setTitle('Админ панель');
    authService.auth.authState.subscribe(user => {
      if (!user) router.navigateByUrl('/');
      authService.isCurrentUserAdmin.then(isAdmin => {
        if (!isAdmin) router.navigateByUrl('/');
      })
    })
  }

  submit() {
    const {id, title, description, tags, imageFile} = this.addPostForm.value;
    const cutTags = (tags as string).replaceAll(' ', '').split(',');
    const image = imageFile as File;
    this.hasPosted = false;
    this.error = '';
    // Prepare for uploading
    const setError = (reason: any) => {
      this.error = reason;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const fullImage = fr.result as string;
      (async () => {
        const thumbnailImage = await ImageResizer.reduceSize(fullImage, 461, 461, 'image/jpeg');
        try {
          const info = {
            id, title, description, fullImage: image, thumbnailImage,
            tags: cutTags
          };
          const uploadProcess = await this.adminService.addPost(info);
          this.isUploading = true;
          uploadProcess?.subscribe((utSnapshot: UploadTaskSnapshot | void) => {
            if (utSnapshot) {
              if (utSnapshot.ref.name === 'full.jpg')
                this.fullImageProgress = utSnapshot.bytesTransferred / utSnapshot.totalBytes;
              if (utSnapshot.ref.name === 'thumbnail.jpg')
                this.thumbnailImageProgress = utSnapshot.bytesTransferred / utSnapshot.totalBytes;
              if (this.fullImageProgress === 1 && this.thumbnailImageProgress === 1) this.hasPosted = true;
            }
          });
        } catch (reason) {
          console.error('error:', reason);
          setError(reason);
        }
      })();
    };
    fr.readAsDataURL(image);
  }

  onFileChange(event: any) {
    this.addPostForm.get('imageFile')?.patchValue(event.target.files[0]);
    this.cd.markForCheck();
  }
}
