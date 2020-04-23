import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Platform, AlertController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  value : string = 'pavani';
  loading:any;
  constructor(public plt:Platform,public loadingCtrl: LoadingController ,public alertCtrl:AlertController,public toastCtrl:ToastController,private newService :CommonProvider, private sanitizer: DomSanitizer,public navCtrl:NavController)
  {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop({animation:"ios-transition"});
      }
      else{
        this.plt.exitApp();
      }

      backAction();
    },1)

//---------------------autorefresh-------------
this.newService.newMessageReceived()
.subscribe(data => {
console.log("newmessage")

this.newService.getProfile().subscribe(data => {


  this.Profiledata=data;

  console.log("Hi")
console.log(this.Profiledata);
console.log(this.Profiledata.name);
console.log(this.Profiledata.mobilenumber)
console.log("getting image")
this.newService.getImage().subscribe(data => {
this.fromdb = data;
this.fromdb = this.fromdb.pic;
console.log(this.fromdb)
var contentType = 'image';
var blob = b64toBlob(this.fromdb, contentType);
this.picUrl = URL.createObjectURL(blob);

function b64toBlob(b64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = sliceSize || 512;
  var byteCharacters = atob(b64Data);
  var byteArrays = [];
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
});
})

})

//-------------------------




   }
  Profiledata:any;
  fromdb:any;
  picUrl:any;
  data:any
  show=false;

  data1=false;





  ngOnInit(){


         //==========================

         this.loading = this.loadingCtrl.create({
          //  dismissOnPageChange: true,
          spinner: 'bubbles',

        });
        this.loading.present();
            //==========================

    this.newService.getProfile().subscribe(data => {


      const Profiledata :any=data
      if(Profiledata.message=="sessionexpired"){
        this.loading.dismiss();
        this.loading=null;


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
      else{

        if(this.newService.getUserLoggedIn())
        {
              this.newService.getProfile().subscribe(data => {
                //===========================


        //===========================

                this.Profiledata=data;

                console.log("Hi")
            console.log(this.Profiledata);
            console.log(this.Profiledata.name);
            console.log(this.Profiledata.mobilenumber)
            console.log("getting image")
            this.newService.getImage().subscribe(data => {
              this.loading.dismiss();
              this.loading=null;

              this.fromdb = data;
              this.fromdb = this.fromdb.pic;
              console.log(this.fromdb)
              var contentType = 'image';
              var blob = b64toBlob(this.fromdb, contentType);
              this.picUrl = URL.createObjectURL(blob);

              function b64toBlob(b64Data, contentType) {
                contentType = contentType || '';
                var sliceSize = sliceSize || 512;
                var byteCharacters = atob(b64Data);
                var byteArrays = [];
                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  var slice = byteCharacters.slice(offset, offset + sliceSize);
                  var byteNumbers = new Array(slice.length);
                  for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                  }
                  var byteArray = new Uint8Array(byteNumbers);
                  byteArrays.push(byteArray);
                }
                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
              }
            });
             }
            );

          }


      }
    });
}

//   ngOnInit() {




//     if(this.newService.getUserLoggedIn())
// {
//       this.newService.getProfile().subscribe(data => {
//         this.Profiledata=data;

//         console.log("Hi")
//     console.log(this.Profiledata);
//     console.log(this.Profiledata.name);
//     console.log(this.Profiledata.mobilenumber)
//     console.log("getting image")
//     this.newService.getImage().subscribe(data => {
//       this.fromdb = data;
//       this.fromdb = this.fromdb.pic;
//       console.log(this.fromdb)
//       var contentType = 'image';
//       var blob = b64toBlob(this.fromdb, contentType);
//       this.picUrl = URL.createObjectURL(blob);

//       function b64toBlob(b64Data, contentType) {
//         contentType = contentType || '';
//         var sliceSize = sliceSize || 512;
//         var byteCharacters = atob(b64Data);
//         var byteArrays = [];
//         for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//           var slice = byteCharacters.slice(offset, offset + sliceSize);
//           var byteNumbers = new Array(slice.length);
//           for (var i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//           }
//           var byteArray = new Uint8Array(byteNumbers);
//           byteArrays.push(byteArray);
//         }
//         var blob = new Blob(byteArrays, { type: contentType });
//         return blob;
//       }
//     });
//      }
//     );

//   }

//   }


qrscan()
{
  this.navCtrl.push('QrscannerPage',null, {animation:"ios-transition"})


}
getimglink() {
  return this.sanitizer.bypassSecurityTrustResourceUrl(this.picUrl);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');

  }
  gotoeditprofile()
  {
    this.navCtrl.push('EditprofilePage',null, {animation:"ios-transition"});

  }
  ionViewCanEnter() {
    if(!this.newService.getUserLoggedIn())
    {
      let toast = this.toastCtrl.create({
        message: 'You are not logged in!!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
    }

  }

  ionViewCanLeave(){
    if(this.loading)
    {
      this.loading.dismiss();
    }
   }

  }
