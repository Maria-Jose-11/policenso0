import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonContent, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService, Datos, Message, User } from '../servicios/auth.service';
import * as CryptoJS from 'crypto-js';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import {PhotoService, UserPhoto} from '../servicios/photo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{

  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>;
  newMsg= '';
  msgEncryption:'';
  passwordAES = 'AndresExamen';
  newFile='';
  uploadProgress= 0;
  img = null;
  user='';
  preimagen=false;
  nombre = null;
  apellido= null;
  cedula= null;
  numfamilia= '';
  uid = null;
  latitude =null;
  longitude = null;
  info: Datos=null;
  profile = null;
  imagen =null;


  constructor(
    private autservice:AuthService,
    private afs:AngularFirestore,
    private router:Router,
    public loadingCtrl: LoadingController,
    private afStorage: AngularFireStorage,
    private alertController: AlertController,
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController
    ) 
    {}

    async ngOnInit(){
      this.messages = this.autservice.getChatMessages();
      this.user = this.autservice.currentUser.email;
      this.uid = this.autservice.currentUser.uid;
      console.log("usuario email: ",this.user);
      console.log("usuario id: ", this.uid);
      this.getUid();
      await this.photoService.loadSaved();
    }
  
    public async showActionSheet(photo: UserPhoto, position: number) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Photos',
        buttons: [{
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
            
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
           }
        }]
      });
      await actionSheet.present();
    }

  async getUid(){
    const uid = await this.autservice.currentUser.uid;
    if(uid){
      this.uid = uid;
      console.log('USUARIO ID VALIDADO: ', this.uid)
      this.getInfoUser();
    }else{
      console.log("no existe uid")
    }
  }

  async sendMessage(){
    const loading = await this.loadingCtrl.create();

    this.msgEncryption = CryptoJS.AES.encrypt(this.newMsg.trim(),this.passwordAES.trim()).toString();
    
    this.autservice.addChatMessage(this.msgEncryption,this.img).then(()=>{
      this.newMsg = '';
      this.msgEncryption='';
      this.img = '';
      this.newFile='';
      this.content.scrollToBottom();
      loading.dismiss();
    })
  }
  

  newMesgImg(event: any){
    console.log("evento",event)
    if (event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.img = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);

    }
  }


  logout(){
    this.autservice.logout().then(()=>{
      this.router.navigateByUrl('/',{replaceUrl:true});
    })
  }

  formulario(){
    this.router.navigateByUrl('/datos-personales', {replaceUrl : true});
  }


  getInfoUser(){
    const path = "datos-censo";
    const id = this.uid;
    this.autservice.getDoc<Datos>(path, id).subscribe(res=>{
      if(res){
        this.info = res;
        this.nombre = this.info.nombre;
        this.apellido=this.info.apellido;
        this.cedula=this.info.cedula;
        this.numfamilia = this.info.numfamilia;
        this.latitude = this.info.latitude;
        this.longitude = this.info.longitude;
        this.imagen = this.info.imagen;
      }
      console.log('datos:', res);
    })
  }

  //-------------ACTUALIZAR INFORMACIÓN-----------------
  //editar
  async editAtributo(name:string){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Editar "+name,
      inputs:[
        {
          name,
          type: 'text',
          placeholder: 'Ingresa tu '+name
        },
      ],
      buttons: [
        //boton cancelar
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () =>{
            console.log("Acción cancelada");
          }
        },
        {
          text: 'Aceptar',
          handler: (ev) =>{
            console.log("Acción confirmada", ev);
            this.saveAtributo(name, ev[name])
          }
        }
    ]
    });
    await alert.present();
  }
  //guardar
  saveAtributo(name: string, input:any){
    const path = "datos-censo";
    const id = this.uid;
    const updateDoc = {
    };
    updateDoc[name] = input
    this.autservice.updateDoc(path, id, updateDoc).then(() =>{
      alert("Actualizado correctamente");
    })
  }

  async addImageToDatos(imagen){
    const path = "datos-censo";
    const id = this.uid;
    const updateDoc = {
       
    };
    updateDoc[imagen] = this.imagen.photo;
    this.autservice.updateDoc(path, id, updateDoc).then(() =>{
      alert("Actualizado correctamente");
    })
  }

  //---------------------PARA IMAGEN-----------------

  upload(){
    
    let file = (<HTMLInputElement>document.getElementById('file')).files[0];
    let ref = this.afStorage.ref('upload'+this.autservice.currentUser.uid+'/'+file.name);
    this.preimagen = true;
    ref.put(file).then(res=>{
      ref.getDownloadURL().subscribe(url=>{
        this.preimagen = false
        this.img = url
      });
    }).catch(err=>{
      console.log(err)
      this.preimagen = false;
    });
  }

}
