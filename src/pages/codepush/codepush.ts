import { CodePush,SyncStatus } from '@ionic-native/code-push';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import * as math from 'mathjs';
@IonicPage()
@Component({
  selector: 'page-codepush',
  templateUrl: 'codepush.html',
})
export class CodepushPage {

  constructor(public loadingCtrl:LoadingController,private codePush:CodePush,public navCtrl: NavController, public navParams: NavParams,public toastCtrl:ToastController) {
    this.finished=false;
  }
  finished:any
  updatetext:any;
  received:any;
  total:any;
  percent:any;
  download:any;
  loading:any;
  ionViewDidLoad() {

    console.log('ionViewDidLoad CodepushPage');
  }

  ionViewCanEnter(){
    const downloadProgress = (progress) => { console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`); }
    let loading = this.loadingCtrl.create({
      spinner: "hide",
      content: "App Update"
    });
  //   this.codePush.sync({},(downloadProgress) =>{
  //     this.received = downloadProgress.receivedBytes;
  //     this.total = downloadProgress.totalBytes;
  //     loading.setContent(`<div><h1>App Update</h1></div><br>
  //     <div class="progress-outer">
  //   <div class="progress-inner">
  //   </div>
  // </div>`+`<div>${math.round((Number(this.received/1048576)),1)} of ${math.round((Number(this.total)/1048576),1)} MB (${math.round((Number(this.received)/Number(this.total)*100),0)}%) loaded</div>`)
  //     loading.present();
  //     if(this.total==this.received)
  //     {
  //       loading.dismiss();
  //     }

  //     // let alert = this.alertCtrl.create({
  //     //   title: 'App Update',
  //     //   message: `${math.round((Number(this.received/1048576)),1)} MB of ${math.round((Number(this.total)/1048576),1)} MB ( ${math.round((Number(this.received)/Number(this.total)*100),0)}%) loaded`
  //     // });
  //     // alert.present();
  //   }).subscribe((status) =>{
  //     if(status==SyncStatus.CHECKING_FOR_UPDATE)
  //     {

  //     }
  //     if(status==SyncStatus.DOWNLOADING_PACKAGE)
  //     {

  //     }
  //     if(status==SyncStatus.INSTALLING_UPDATE)
  //     {

  //     }
  //     if(status==SyncStatus.UP_TO_DATE)
  //     {

  //       let toast = this.toastCtrl.create({
  //         message:'App updated',
  //         duration: 3000,
  //         position: 'top'
  //       });
  //       toast.present();
  //       this.codePush.restartApplication();
  //     }
  //   })


    this.codePush.sync({},(progress)=>{

   }).subscribe((status)=>{
     if(status==SyncStatus.CHECKING_FOR_UPDATE)
     {
       loading.setContent("Checking for Update");
     }
     if( status == SyncStatus.DOWNLOADING_PACKAGE)
     {
       loading.setContent("Downloading latest App.....");
     }
     if( status == SyncStatus.INSTALLING_UPDATE)
     {
      loading.setContent("Installing latest App.....");
     }
     if( status == SyncStatus.UPDATE_INSTALLED)
     {
       loading.setContent("App successfully Updated!!!!");
       loading.dismiss();
       this.codePush.restartApplication();
     }
     if(status==SyncStatus.UP_TO_DATE)
     {
       this.navCtrl.setRoot('HomePage')
     }
   },(err)=>{
     console.log(err)
   })
  }


  // ionViewCanLeave(){
  //   if(this.loading)
  //   {
  //     this.loading.dismiss();
  //   }
  //  }
}
