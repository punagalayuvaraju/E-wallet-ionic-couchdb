import { CommonProvider } from './../../providers/common/common';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController,Platform } from 'ionic-angular';
import {BarcodeScanner,BarcodeScannerOptions}from '@ionic-native/barcode-scanner';
@IonicPage()
@Component({
  selector: 'page-qrscanner',
  templateUrl: 'qrscanner.html',
})
export class QrscannerPage {

  options:BarcodeScannerOptions;
  encodText:string='';
  encodedData:any={};
  Repdata:any;
  Benedata:any;
  clicked1=false;
  myData:any;
  mydata:any;
  scannedData:any
  constructor(public plt:Platform,public alertCtrl:AlertController,public newService:CommonProvider,public toastCtrl:ToastController,public navCtrl: NavController, public navParams: NavParams,public scanner:BarcodeScanner) {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop({animation:"ios-transition"});
      }
      else{
        this.plt.exitApp();
      }

      backAction();
    },1)
  }

  ngOnInit(){
    this.newService.getProfile().subscribe(data => {
      const Profiledata :any=data
      if(Profiledata.message=="sessionexpired"){
        this.newService.setUserLogout();
        // alert("Your session is expired... please login again to continue.")
        let toast = this.toastCtrl.create({
          message: 'Your session is expired... please login again to continue',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
      }
      else{}
    });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrscannerPage');
  }


  ionViewCanEnter(){
    if(!this.newService.getUserLoggedIn())
    {
      console.log("Not logged")
      let toast = this.toastCtrl.create({
        message: 'You are not logged in!!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
    }
    this.options={
      prompt:'Scan QRcode',
      resultDisplayDuration: 0
    };
    this.scanner.scan(this.options).then((data) => {
      this.scannedData=data.text;
      if(this.scannedData){
        var mydata = this.scannedData;

        const transactiondata = {
          data: mydata.substr(5,15)
        }
        this.newService.qrscan(transactiondata).subscribe(data => {
          this.Repdata = data
          console.log(this.Repdata)
          if(this.Repdata.res=="notexist")
          {


           this.navCtrl.setRoot('MenuPage',null, {animation:"ios-transition"}).then(() => {
            let toast = this.toastCtrl.create({
              message: 'This mobile number doest not exist',
              duration: 3000,
              position: 'top'
            });
            toast.present();
           });


          }
          else{
            this.navCtrl.push('MovetoPage',{id:this.Repdata}, {animation:"ios-transition"}).then(() => {
              const startIndex = this.navCtrl.getActive().index - 1;
              this.navCtrl.remove(startIndex, 1);
                 });
          }

        });

      }
      else{
        this.navCtrl.setRoot('MenuPage',null, {animation:"ios-transition"});
      }

    },(err)=>{
      console.log('Error:',err);

    })
  }
}

