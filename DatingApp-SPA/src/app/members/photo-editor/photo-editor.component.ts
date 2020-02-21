import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/Photo';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  uploader: FileUploader;
  hasBaseDropZoneOver;
  hasAnotherDropZoneOver;
  baseUrl = environment.apiUrl;
  @Input() photos: Photo[];
  @Output() updatePhotoEvent = new EventEmitter<string>();
  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.intializeUploader();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  intializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
      disableMultipart: false,
      method: 'post'
    });
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        this.photos.push(res);
      }
    };
  }
  setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        next => {
          const currentMainPhoto = this.photos.filter(
            p => p.isMain === true
          )[0];
          currentMainPhoto.isMain = false;
          photo.isMain = true;
          this.authService.changePhotoUrl(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
        },
        err => this.alertifyService.error(err)
      );
  }
  deletePhoto(id: number) {
    this.alertifyService.confirm(
      'Are you sure you want to delete this photo',
      () => {
        this.userService
          .deletePhoto(this.authService.decodedToken.nameid, id)
          .subscribe(
            next => {
              const indexOfPhotoToDelete = this.photos.findIndex(
                p => p.id === id
              );
              this.photos.splice(indexOfPhotoToDelete, 1);
              this.alertifyService.success('Successfully deleted.');
            },
            err => this.alertifyService.error(err)
          );
      }
    );
  }
}
