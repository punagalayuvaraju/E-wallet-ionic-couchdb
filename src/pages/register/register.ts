import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  clicked09=false;
  showotp=false;
  wait=false;
  type="password";
  type1="password";
    clicked45=false;
    show1=true;
    show=true;
    hide = true;
    loading:any;




    buttonname="Verify"
    resendenable=true
    verifyclicked=false

  constructor(public plt:Platform,public loadingCtrl: LoadingController,public alertCtrl:AlertController,private newService :CommonProvider,public navCtrl:NavController,public toastCtrl: ToastController) {
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

  register = function(user) {
    // ============================
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================

    console.log(user.value)
    this.newService.register(user.value)

    .subscribe( data => {

         //==========================

     this.loading.dismiss();
     this.loading=null;
     //==========================
      if(data.res=="success")
      {

        let toast = this.toastCtrl.create({
          message: 'Registered succesfully',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.maxTime=0;
        this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
      }
      else if(data.res=="OTPFAILED"){

        let toast = this.toastCtrl.create({
          message: 'OTP verification failed',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.OTP=null;


      }
      else if(data.res=="OTP-expired")
      {
        // alert("OTP Expired... Please click on resend button again..");
        let toast = this.toastCtrl.create({
          message: 'OTP Expired... Please click on resend button again..',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.maxTime=0;
        this.resendenable=true;
        this.OTP=null;
      }
      else if(data.res=="block")
      {
        // alert("OTP Expired... Please click on resend button again..");
        let toast = this.toastCtrl.create({
          message: 'Your OTP is blocked... Please fill your details again..',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.resendenable=true;
        this.OTP=null;
        this.buttonname="Verify";
        user.resetForm();
        this.maxTime=0;
      }
      else
      {
        let toast = this.toastCtrl.create({
          message: data.res,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        // this.wait=false;
        this.maxTime=0;

      }


    }, error => this.errorMessage = error )


  }
  verifyemail = function(user) {

    // ============================
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================
    this.maxTime=120;
    this.StartTimer();
    this.verifyclicked=true;

    this.resendenable=false;
    this.buttonname="Resend";

    this.newService.verifyemail(user.value)

    .subscribe( data => {
         //==========================

     this.loading.dismiss();
     this.loading=null;
     //===========================
      console.log(data)
      if(data.res=="success"){
      this.showotp=true;

      let toast = this.toastCtrl.create({
        message: 'Check your E-Mail inbox for OTP',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.wait=false;


    }

    else if(data.res=="mobile number is already exits")
    {

      let toast = this.toastCtrl.create({
        message: 'mobile number already Exists',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.resendenable=true;
      this.buttonname="Verify";
        this.OTP=null;
        this.maxTime=0;


    }


      else if(data.res=="email is already exits"){

        let toast = this.toastCtrl.create({
          message: 'Email already Exists',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.resendenable=true;
        this.buttonname="Verify";
          this.OTP=null;
          this.maxTime=0;
      }
      else
      {
        let toast = this.toastCtrl.create({
          message: 'Enter correct E-Mail address',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.resendenable=true;
        this.OTP=null;
        this.maxTime=0;
      }

    });



  }



  myFunction1()
  {
    this.clicked45=!this.clicked45;
    this.show1=!this.show1;
    if(this.clicked45)
    {
      this.type1="text";
    }
    else if(!this.clicked45)
    {
      this.type1="password";
    }
  }
  myFunction()
  {
    this.clicked09=!this.clicked09;
    this.show=!this.show;
    if(this.clicked09)
    {
      this.type="text";
    }
    else if(!this.clicked09)
    {
      this.type="password";
    }
  }



  maxTime: any=120;
  timer;

  StartTimer(){
    this.timer = setTimeout(x =>
      {

          this.maxTime -= 1;

          if(this.maxTime>0){
            this.StartTimer();
          }

          else
          {
            this.resendenable=true;

          }

      }, 1000);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
}

ionViewCanLeave(){
  if(this.loading)
  {
    this.loading.dismiss();
  }
 }
}
