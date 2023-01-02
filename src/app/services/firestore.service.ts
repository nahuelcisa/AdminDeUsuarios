import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  usuariosCollectionsreference: any;
  usuarios: Observable<any>;

  usuariosArray : any = [];

  constructor(private angularF : AngularFirestore, private AngularFS : AngularFireStorage) 
  {
    this.usuariosCollectionsreference = this.angularF.collection<any>('adminUsuarios');
    this.usuarios = this.usuariosCollectionsreference.valueChanges({idField: 'id'});

    this.traerUsuarios().subscribe(value => {
      this.usuariosArray = value;
    });
  }

  subirImagen(archivo : string, datos : any){
    return this.AngularFS.upload(archivo,datos);
  }

  agregarUsuario(user: any){
    this.usuariosCollectionsreference.add({...user});
  }

  referenciaArchivo(archivo : string){
    return this.AngularFS.ref(archivo);
  }

  traerUsuarios()
  {
    return this.usuarios;
  }

}