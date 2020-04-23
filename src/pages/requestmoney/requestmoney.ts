import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

import { Socket } from 'ng-socket-io';
import { LocalNotifications } from '@ionic-native/local-notifications';
@IonicPage()
@Component({
  selector: 'page-requestmoney',
  templateUrl: 'requestmoney.html',
})

export class RequestmoneyPage implements OnInit{

  Menudata:any;
  data:any;
  id:any;
  myid:any
  mysess:any;
  myData:any;
  name:any;
  mobile:any;
  beneficiaryac:any;
  loading:any;

  constructor(public plt:Platform,public loadingCtrl: LoadingController ,private newService:CommonProvider, public navCtrl: NavController, public navParams: NavParams,public toastCtrl:ToastController, public localNotifications: LocalNotifications,public alertCtrl: AlertController,public platform: Platform) {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop({animation:"ios-transition"});
      }
      else{
        this.plt.exitApp();
      }

      backAction();
    },1)
    this.data = { title:'', description:'', date:'', time:'' };
    var date = new Date(this.data.date+" "+this.data.time);

  }
  valbutton ="save";

  accounts:any;

  ngOnInit(){
    // ============================


}




//   ngOnInit(){
//     if(this.newService.getUserLoggedIn())
// {
//     this.newService.getbeneficiary().subscribe(
//         data => {
//           console.log("data")
//           console.log(data);
//           this.accounts=data;
//           this.newService.getProfile().subscribe(data => {
//             this.Menudata=data;
//           })
//         }
//     )
//   }
//   }



addbeneficiary(){
  localStorage.setItem('navigate','true');
  this.navCtrl.push('AddbeneficiaryPage', null, { animation: "ios-transition" });

}

  requestmoney = function(user) {
    // ============================
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================
    console.log(user.value)
    console.log(this.mno);
    user.mode = this.valbutton;

    this.newService.requestmoney(user.value)

  .subscribe( data => {
     //==========================

     this.loading.dismiss();
     this.loading=null;

     //==========================
    var res=data.result;
    console.log(res);
    if(res=="failed"){
      let toast = this.toastCtrl.create({
        message: 'failed !!! try again later!!!',
        duration: 3000,
        position: 'top'
      });
      toast.present();

    }
    else if(res=="block")
    {
      let toast = this.toastCtrl.create({
        message: 'That account is blocked',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      user.resetForm();

    }

    else{
      let toast = this.toastCtrl.create({
        message: 'Your request is submitted',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      user.resetForm();

      // if(this.id)
      // {
      //   user.controls['amount1'].reset();
      //   user.controls['comment1'].reset();

      // }
      // else{
      //      user.resetForm();

      // }

      if(user.value.beneficiaryac==this.Menudata.mobilenumber)
      {
        this.localNotifications.schedule({
          text: 'Delayed ILocalNotification',
          at: this.date,
          led: 'FF0000',
       });
       let alert = this.alertCtrl.create({
         title: 'Congratulation!',
         subTitle: 'Notification setup successfully at '+this.date,
         buttons: ['OK']
       });
       alert.present();
       this.data = { title:'', description:'', date:'', time:'' };
      }


    }
  }, error => this.errorMessage = error )

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestmoneyPage');
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
    else
    {
      this.loading = this.loadingCtrl.create({
        //  dismissOnPageChange: true,
        spinner: 'bubbles',

      });
      this.loading.present();
      //====================================
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
                  this.newService.getbeneficiary().subscribe(
                      data => {

                        //===========================
              this.loading.dismiss();
              this.loading=null;


              //===========================
                        console.log("data")
                        console.log(data);
                        this.accounts=data;
                        this.newService.getProfile().subscribe(data => {
                          this.Menudata=data;
                        })
                      }
                  )
                }

            }
          });
    }
    this.id=this.navParams.get('id')
    this.myid=this.navParams.get('id')
    this.name=this.navParams.get('name')
    this.mobile=this.navParams.get('mobile')
    this.beneficiaryac=this.mobile;


  }




  ionViewCanLeave(){
    if(this.loading)
    {
      this.loading.dismiss();
    }
   }
}
