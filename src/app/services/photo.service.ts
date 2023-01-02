import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { getStorage, ref, uploadString } from "firebase/storage"
import { AuthService } from './auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(public as : AuthService, private afs : AngularFireStorage, private fs : FirestoreService) { }

  public async addNewToGallery( user : any) {
    
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
      webUseInput: true
    });

    let storage = getStorage();
    let date = new Date().getTime();

    let nombre = `${user.email}${user.dni}`;

    let storageRef = ref(storage, nombre);

    let url = this.afs.ref(nombre);

    let retorno = {
      storage: storageRef,
      dataurl: capturedPhoto.dataUrl,
      url: url
    }

    /* uploadString(storageRef,capturedPhoto.dataUrl, 'data_url').then(()=>{
      url.getDownloadURL().subscribe((url1 : any)=>{
        console.log('url1' + url1);
        test = url1;
        return test;
      })
      return test;
    }); */
    return retorno;

  }
}
