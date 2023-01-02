import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { toastController } from '@ionic/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import { AuthService } from 'src/app/services/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  clave: string;
  apretado: boolean = false;

  slideUsuario: boolean = false;
  slideAdmin: boolean = false;
  slideInvitado: boolean = false;

  constructor(private auth: AngularFireAuth, private router: Router, public toast: ToastController, public as : AuthService) { }

  ngOnInit() {
  }

  iniciarSesion(){
    this.as.login(this.email,this.clave);
  }

  inicioRapido(a){
    switch (a) {
      case 1:
        this.email = "usuarioTest@gmail.com";
        this.clave = "123456";
      break;

      case 2:
        this.email = "adminTest@gmail.com";
        this.clave = "123456";
      break;

      case 3:
        this.email = "invitadoTest@gmail.com";
        this.clave = "123456";
      break;

      case 4:
        this.email = "";
        this.clave = "";
      break;
    }
  }

  onChangeUsuario(ob: MatSlideToggleChange) {
    if(ob.checked){
      this.slideUsuario = true;
      this.slideAdmin = false;
      this.slideInvitado = false;

      this.inicioRapido(1);
    }else{
      this.slideUsuario = false;
      this.inicioRapido(4);
    }
  }

  onChangeAdmin(ob: MatSlideToggleChange) {

    if(ob.checked){
      this.slideUsuario = false;
      this.slideAdmin = true;
      this.slideInvitado = false;

      this.inicioRapido(2);
    }else{
      this.slideAdmin = false;
      this.inicioRapido(4);
    }
  }

  onChangeInvitado(ob: MatSlideToggleChange) {

    if(ob.checked){
      this.slideUsuario = false;
      this.slideAdmin = false;
      this.slideInvitado = true;

      this.inicioRapido(3);
    }else{
      this.slideInvitado = false;
      this.inicioRapido(4);
    }
  }

}
