import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';


@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

  constructor(public plt:Platform,public loadingCtrl: LoadingController ,public navCtrl: NavController, public navParams: NavParams,private newService:CommonProvider,public toastCtrl:ToastController,public alertCtrl:AlertController) {
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

  res:any;
  show= false
  type=false
  formhide=true;
loading:any;

  clicked52=false;
  clicked53=false;
  clicked54=false;
  type1="password";
  type2="password";
  type3="password";
    show1=true;
    show2=true;
    show3=true;

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


  changePass = function(user) {

     //==========================

 this.loading = this.loadingCtrl.create({
  //  dismissOnPageChange: true,
  spinner: 'bubbles',

});
this.loading.present();
    //==========================


        console.log(user);
   this.newService.changePass(user.value).subscribe( data => {

//===================
this.loading.dismiss();
this.loading=null;

//-=========================
     var res = data

     if(res.result =="success"){
      //  this.show=true;
       this.res="Password updated successfully"
      //  this.type=true
       console.log(this.res)


      console.log("*************************")
      this.newService.getuserpass().subscribe(data => {
        this.Menudata=data;
        let toast = this.toastCtrl.create({
          message: 'Password updated successfully.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        localStorage.setItem('user',this.Menudata.mydata.mobileno);
        localStorage.setItem('pass',this.Menudata.mydata.password);
        this.newService.setUserLogout();
        this.newService.logout()
        this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
      });


     }
     else if(res.result=="OTPWRONG"){
      let toast = this.toastCtrl.create({
        message: 'Incorrect OTP',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.formhide=true;

      // user.resetForm();

     }
     else if(res.result=="OTP-expired")
     {
      let toast = this.toastCtrl.create({
        message: 'OTP expired',
        duration: 3000,
        position: 'top'
      });
      toast.present();

      this.show=false;
      this.formhide=true;
      this.otp=null;


     }
     else if(res.result=="block"){

      let toast = this.toastCtrl.create({
        message: 'Your account is blocked',
        duration: 3000,
        position: 'top'
      });
      toast.present();

      this.newService.setUserLogout();
      this.newService.logout()
      this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});

     }
       else{
       this.res="failed !!!"
       this.type=false
       console.log(this.res)
      let toast = this.toastCtrl.create({
        message: 'old password is incorrect',
        duration: 3000,
        position: 'top'
      });
      toast.present();

      user.resetForm();
      this.formhide=true;
      this.show=false;



     }
   }
   );
  //  user.resetForm()


}

//=============================================
otpfun = function(user)
{
    // ============================
     this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================
this.show=true;
this.formhide=false;
console.log('user')
user.mode = this.valbutton;

this.newService.otpfun(user.value)
.subscribe( data => {
 //==========================

 this.loading.dismiss();
 this.loading=null;

 //==========================

if(data.res=="success"){
  // this.showotp=true;
  //  alert("Check your E-Mail inbox for OTP");

   let toast = this.toastCtrl.create({
    message: 'Check your E-Mail inbox for OTP',
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
else if(data.res=="password incorrect"){
  this.formhide=true;
  this.show=false;
  user.resetForm();
  let toast = this.toastCtrl.create({
    message: 'old password is incorrect',
    duration: 3000,
    position: 'top'
  });
  toast.present();


}
  else{
    let toast = this.toastCtrl.create({
      message: 'Enter correct E-Mail address',
      duration: 3000,
      position: 'top'
    });
    toast.present();

  }
}, error => this.errorMessage = error )
}
//===================================

/////////////////////////////////////////

// otpfun = function(user)
// {
// this.show=true;
// this.formhide=false;
// console.log('user')
// user.mode = this.valbutton;
// this.newService.otp(user.value)
// .subscribe( data => {
// if(data.res=="success"){
//   this.showotp=true;
//    alert("Check your E-Mail inbox for OTP");
// }
//   else{
//     alert("Enter correct E-Mail address");
//   }

// }, error => this.errorMessage = error )


// }


//////////////////////////////////

myFunction()
    {
      this.clicked52=!this.clicked52;
      this.show1=!this.show1;
      if(this.clicked52)
      {
        this.type1="text";
      }
      else if(!this.clicked52)
      {
        this.type1="password";
      }
    }
    myFunction1()
    {
      this.clicked53=!this.clicked53;
      this.show2=!this.show2;
      if(this.clicked53)
      {
        this.type2="text";
      }
      else if(!this.clicked53)
      {
        this.type2="password";
      }
    }
    myFunction2()
    {
      this.clicked54=!this.clicked54;
      this.show3=!this.show3;
      if(this.clicked54)
      {
        this.type3="text";
      }
      else if(!this.clicked54)
      {
        this.type3="password";
      }
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
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



