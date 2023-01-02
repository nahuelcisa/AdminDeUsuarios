import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { uploadString } from 'firebase/storage';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  apellido: string = null;
  nombre: string = null;
  dni : number = null;
  correo : string = null;
  clave: string = null;
  claveR: string = null;
  contenido : string[];

  usuario : any = undefined;
  avatar : string = '../../../assets/avatar.png';

  esAdministrador : boolean ;
  formulario : boolean  ;
  listadoAdmin:boolean;

  apretado: boolean = false;

  constructor(private auth: AngularFireAuth, private router: Router, public scanner : ScannerService, public as : AuthService,
    public ps : PhotoService, private toast : ToastController , public fs : FirestoreService) {
  }

  escanear(){
    this.scanner.test().then((a)=>{
      this.contenido = a.split('@');
      this.apellido = this.contenido[1].charAt(0) + this.contenido[1].slice(1).toLocaleLowerCase();
      this.nombre  = this.contenido[2].charAt(0) + this.contenido[2].slice(1).toLocaleLowerCase();
      this.dni  = parseInt(this.contenido[4]);
      this.scanner.stopScan();
    });
  }

  ngOnInit() :void{
    this.perfil()
  }

  verificarFormulario(){
    let error = false;

    if(this.apellido == null && this.nombre == null && this.dni == null && 
      this.correo == null && this.clave == null && this.claveR == null){
        this.MostrarToastError('Formulario vacio.').then((toast)=>{
          toast.present();
        });
        error = true;
    }
    else if(this.apellido == null){
      this.MostrarToastError('Apellido no valido.').then((toast)=>{
        toast.present();
      });
      error = true;
    }
    else if(this.nombre == null){
      this.MostrarToastError('Nombre no valido.').then((toast)=>{
        toast.present();
      });
      error = true;
    }
    else if(this.dni == null){
      this.MostrarToastError('Dni no valido.').then((toast)=>{
        toast.present();
      });
      error = true;
    }
    else if(this.correo == null || !this.correo.includes('@') || !this.correo.includes('.com')){
      this.MostrarToastError('Correo no valido.').then((toast)=>{
        toast.present();
      });
      error = true;
    }
    else if(this.clave == null || this.clave != this.claveR){
      this.MostrarToastError('Clave no valida.').then((toast)=>{
        toast.present();
      });
      error = true;
    }
    else if(this.claveR == null || this.clave != this.claveR){
      this.MostrarToastError('Reingreso de clave no valida.').then((toast)=>{
        toast.present();
      });
      error = true;
    }else if(this.usuario == undefined){
      this.MostrarToastError('Foto no valido.').then((toast)=>{
        toast.present();
      });
      error = true;
    }
    return error;
  }

  listadoAdministrador(){
    this.apretado = true;

    setTimeout(() => {
      this.formulario = false;
      this.listadoAdmin = true;
      this.apretado = false;
      
    }, 2000); 
  }

  backForm(){
    this.apretado = true;
    setTimeout(() => {
      this.formulario = true;
      this.listadoAdmin = false;

      this.apretado = false;

    }, 2000);
  }

  agregarUsuario(){
    let errores = this.verificarFormulario();
    console.log(errores);
    if(errores == false){
      this.apretado = true;
      setTimeout(() => {
        this.as.registro(this.usuario).then(()=>{
          this.apellido = '';
          this.nombre = '';
          this.dni = null;
          this.correo = '';
          this.clave = '';
          this.claveR = '';
          this.fs.agregarUsuario(this.usuario);
          this.MostrarToast('Usuario agregado.').then((toast : any )=>{
            toast.present();
            this.avatar = '../../../assets/avatar.png';
          });
        });
        this.apretado = false;
      }, 3000);
    }
  }

  MostrarToast(message : string)
  {
    return this.toast.create({
            header: 'Exito',
            message: message,
            buttons: ['Ok'],
            position: 'top',
            color: 'success'
    });
  }

  MostrarToastError(message : string)
  {
    return this.toast.create({
            header: 'Error',
            message: message,
            buttons: ['Ok'],
            position: 'top',
            color: 'danger'
    });
  }

  agregarFoto(){
      this.usuario = {
        apellido : this.apellido,
        nombre : this.nombre,
        dni : this.dni,
        email : this.correo,
        password : this.clave,
        pathFoto : ''
      }
      this.apretado = true;
      setTimeout(() => {
        this.ps.addNewToGallery(this.usuario).then((data)=>{
          console.log(data);
          uploadString(data.storage,data.dataurl, 'data_url').then(()=>{
            data.url.getDownloadURL().subscribe((url1 : any)=>{
              console.log('url1' + url1);
              this.usuario.pathFoto = url1;
              this.avatar = url1;
  
              this.MostrarToast('Foto agregado.').then((toast : any )=>{
                toast.present();
                this.apretado = false;
              });
            });
        });
      });
        
      }, 3000);
  }

  altaUsuario(){

  }

  perfil(){
    
    if(this.as.perfil == 'admin'){
      
      this.esAdministrador = true;
      this.formulario = false;
      this.listadoAdmin = true;
    }else{
      this.esAdministrador = false;
      this.formulario = false;
      this.listadoAdmin = false;
    }
  }

  logOut(){
    this.auth.signOut().then(()=>{

      this.apretado = true;

      setTimeout(()=>{
        
        this.router.navigate(["/login"]);
        localStorage.clear();

        this.apretado = false;
        
      },2000);
    });
  }

}
