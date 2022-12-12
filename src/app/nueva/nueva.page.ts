import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-nueva',
  templateUrl: './nueva.page.html',
  styleUrls: ['./nueva.page.scss'],
})
export class NuevaPage implements OnInit {

  ngOnInit() {
  }

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<FILE[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage
  ) {
    this.isImgUploading = false;
    this.isImgUploaded = false;
    
    this.ngFirestoreCollection = angularFirestore.collection<FILE>('filesCollection');
    this.files = this.ngFirestoreCollection.valueChanges();
  }


  fileUpload(event: FileList) {
      
      const file = event.item(0)

      if (file.type.split('/')[0] !== 'image') { 
        console.log('File type is not supported!')
        return;
      }

      this.isImgUploading = true;
      this.isImgUploaded = false;

      this.FileName = file.name;

      const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;

      const imageRef = this.angularFireStorage.ref(fileStoragePath);

      this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);

      this.progressNum = this.ngFireUploadTask.percentageChanges();
      this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
        
        finalize(() => {
          this.fileUploadedPath = imageRef.getDownloadURL();
          
          this.fileUploadedPath.subscribe(resp=>{
            this.fileStorage({
              name: file.name,
              filepath: resp,
              size: this.FileSize
            });
            this.isImgUploading = false;
            this.isImgUploaded = true;
          },error => {
            console.log(error);
          })
        }),
        tap(snap => {
            this.FileSize = snap.totalBytes;
        })
      )
  }


  fileStorage(image: FILE) {
      const ImgId = this.angularFirestore.createId();
      
      this.ngFirestoreCollection.doc(ImgId).set(image).then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      });
  }  

  

}
