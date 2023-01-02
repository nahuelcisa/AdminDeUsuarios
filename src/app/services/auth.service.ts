import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apretado : boolean = false;
  logeado : any;
  perfil : string = '';

  constructor(public auth : AngularFireAuth, public router : Router, private toastController : ToastController) { }

  MostrarToast(message : string)
  {
    return this.toastController.create({
            header: 'Error',
            message: message,
            buttons: ['Ok'],
            position: 'top'
    });
  }

  login(email : string, password : string)
  {
    this.apretado = true;
    this.auth.signInWithEmailAndPassword(email,password).then(() =>
    {
      setTimeout(() => {
        this.apretado = false;
        this.logeado = {
          email : email,
          clave : password
        }
        if(this.logeado.email == 'adminTest@gmail.com'){
          this.perfil = 'admin';
        }else{
          this.perfil = '';
        }
        this.router.navigate(['/home']);
      }, 2000);
    
    }).catch(response =>{
      
      this.apretado = false;
      if(response.code == 'auth/user-not-found')
      {
          this.MostrarToast('La contraseña o el email son incorrectos').then((toast : any) => {
            toast.present();
          })
      }
      else{
        
        if(response.code == 'auth/wrong-password' || response.code == 'auth/wrong-email')
        {
          this.MostrarToast('La contraseña o el email son incorrectos').then((toast : any) => {
            toast.present();
          })
        }
        else{
          if(response.code == 'auth/missing-email' || response.code == 'auth/missing-password')
          {
            this.MostrarToast('No puede haber ningún campo vacío').then((toast : any) => {
              toast.present();
            })
          }
          else
          {
            if(response.code == 'auth/invalid-email' || response.code == 'auth/invalid-password')
            {
              this.MostrarToast('La contraseña o el email son incorrectos').then((toast : any) => {
                toast.present();
              })
            }
          }
        }
      }
    })
  }

  registro(usuario : any)
  {
    console.log(usuario);
    return this.auth.createUserWithEmailAndPassword(usuario.email,usuario.password);
  }

  logOut()
  {
    this.apretado = true;
    this.auth.signOut();

    setTimeout(() => {
      this.apretado = false;
      this.router.navigate(['/login']);    
    }, 2000);
  }
}