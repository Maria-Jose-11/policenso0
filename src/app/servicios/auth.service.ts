import { Injectable } from '@angular/core';
import{AngularFireAuth} from '@angular/fire/auth';
import{AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import "firebase/firestore"
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';


export interface User {
  uid:string;
  email:string;
  
}

export interface Message{
  createAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName:string;
  myMsg:boolean;
  img:File;
  

}

export interface Datos{
  nombre:string;
  apellido:string;
  cedula:string;
  numfamilia:string;
  latitude: string;
  longitude:string;
  imagen:string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser:User = null;
  currentDatos:Datos = null;
  msgDesEncryp:string;

  constructor(private AFauth: AngularFireAuth, private afs:AngularFirestore, public storage: AngularFireStorage) {
    this.AFauth.onAuthStateChanged(user=>{
      console.log("Change",user);
      this.currentUser=user;
    })
  }

  login(email:string,password:string){
    return new Promise((resolve,rejected)=>{
      this.AFauth.signInWithEmailAndPassword(email,password).then(user =>{
        resolve(user)
      }).catch(err=>rejected(err));
    });  
  }

  async singUp(email:string,password:string){
    const credential = await this.AFauth.createUserWithEmailAndPassword(email,password);

    console.log("Credential:"+credential)

    const uid = credential.user.uid;
    
    return this.afs.doc(
      `users/${uid}`
    ).set({
      uid,
      email: credential.user.email
    });
  }

  addChatMessage(msg,img){
    return this.afs.collection("messages").add({
      msg,
      img,
      from:this.currentUser.uid,
      createAt: firebase.firestore.FieldValue.serverTimestamp()
    })

  }

  getChatMessages(){
    let users = [];

    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        console.log("Usuarios",users);
        return this.afs.collection("messages",ref => ref.orderBy("createAt")).valueChanges({idField:'id'}) as Observable<Message[]>;
      }),
      map(messages => {
        for(let m of messages){
          this.msgDesEncryp = CryptoJS.AES.decrypt(m.msg, "AndresExamen").toString(CryptoJS.enc.Utf8);
          m.msg = this.msgDesEncryp;
          m.fromName = this.getUserForMsg(m.from,users);
          m.myMsg = this.currentUser.uid == m.from;
          
        }
        console.log("Mensajes",messages)
        return messages;
      })
    )
  }


  createCollection(data: any, path:string, id:string){
    const collection = this.afs.collection(path);
    return collection.doc(id).set(data);

  }

  // addDatosPersonales(email, nombre, apellido, cedula, numfamilia){
  //   return this.afs.collection("censo").add({
  //     email,
  //     nombre,
  //     apellido,
  //     cedula,
  //     numfamilia,
  //     from:this.currentUser.uid,   
  //     createAt: firebase.firestore.FieldValue.serverTimestamp()
  //   })
  // }

  getUsers(){
      return this.afs.collection('users').valueChanges({idField:'uid'}) as Observable<User[]>;
  }

  getUserForMsg(msgFromId, users:User[]):string{
    for(let usr of users){
      console.log("user.uid",usr.uid);
      console.log("msgFromId",msgFromId);
      if(usr.uid == msgFromId){
        console.log("email",usr.email);
        return usr.email;
      }
    }

    return "Anonimo";
  }

  uploadImage(f: any, path: string, name: string): Promise<string>{
    return new Promise( resolve => {
      const fPath = path + '/' + name;
      const ref =  this.storage.ref(fPath);
      const Task =  ref.put(f);
      Task.snapshotChanges().pipe(
        finalize( () => {
          ref.getDownloadURL().subscribe(res => {
            const downUrl = res;
            resolve(downUrl);
            return;
          });
        })
      ).subscribe();
    });
  }

  logout(){
    return this.AFauth.signOut();
  }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {

      this.AFauth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })

  }

  //---------------------PARA LEER INFORMACIÓN DE USUARIO-----------------
  //INTENTAR BORRANDO <TIPO>
  getDoc <tipo> (path:string, id:string){
    return this.afs.collection(path).doc<tipo>(id).valueChanges();
  }

  async addDatosPersonales(email, nombre, apellido, cedula, numfamilia, latitude, longitude){
    const datos = {
      email, 
      nombre, 
      apellido, 
      cedula, 
      numfamilia,
      latitude,
      longitude,
      from:this.currentUser.uid,   
      createAt: firebase.firestore.FieldValue.serverTimestamp()
    }
    console.log('datos', datos);
    const path = "datos-censo";
    const id = this.currentUser.uid;
    this.createCollection(datos, path, id);
  }

  // async addImageToDatos(imagen){
  //   const datos = {
  //     imagen,
  //   }
  //   console.log('url image', datos);
  //   const path = "datos-censo";
  //   const id = this.currentUser.uid;
  //   this.createCollection(datos, path, id)
  // }

  async getUid(){
    const user = await this.currentUser;
    if (user){
      return user.uid;
    } else{
      return null;
    }
  }

  getUid1(){
    const uid = this.afs.collection('users');
    return this.afs.collection('users').valueChanges({idField:'uid'})
    // .valueChanges({idField:'uid'});
    //return uid.doc().valueChanges({idField:'uid'});
}

updateDoc(path: string, id: string, data: any){
  return this.afs.collection(path).doc(id).update(data);
}
  
}
