import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit {

  arrayUsuarios : any = [];

  constructor(public as : AuthService, private fs : FirestoreService) { }

  ngOnInit() {
    
    this.fs.traerUsuarios().subscribe((value)=>{
      this.arrayUsuarios = value;
      this.arrayUsuarios.sort(this.ordenar);   
    });   
  }

  ordenar(a:any,b:any){
    if (a.nombre > b.nombre) {
      return 1;
    }
    else if (a.nombre < b.nombre) {
      return -1;
    }else {
      return 0;
    }
  }

}
