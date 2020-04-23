import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

@IonicPage()
@Component({
  selector: 'page-addmoney',
  templateUrl: 'addmoney.html',
})
export class AddmoneyPage {
loading:any;
  constructor(public plt:Platform,public loadingCtrl: LoadingController ,public navCtrl: NavController,public alertCtrl: AlertController, public toastCtrl: ToastController,private newService: CommonProvider) {
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

    // ============================on confirm navigate==============
    // const confirm = this.alertCtrl.create({
    //   title: 'ADD MONEY',
    //   message: 'Do you agree to send money?',
    //   buttons: [
    //     {
    //       text: 'Disagree',
    //       handler: () => {
    //         console.log('Disagree clicked');
    //       }
    //     },
    //     {
    //       text: 'Agree',
    //       handler: () => {
    //         console.log('Agree clicked');
    //         this.navCtrl.push('HomePage');

    //       }
    //     }
    //   ]
    // });
    // confirm.present();
    // this.navCtrl.setRoot(MenuPage);

    // =========================================


    addMoney = function(user) {

    // ============================
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });

    this.loading.present();
    //====================================

      console.log(user.value)
      console.log("hiii")
  if(this.newService.getUserLoggedIn())
{
      this.newService.addmoney(user.value)

      .subscribe( data => {
        //==========================

       this.loading.dismiss();
       this.loading=null;
       //==========================
        var res=data.res;


        console.log(res)
        if(res=="Insufficient Funds"){
          let toast = this.toastCtrl.create({
            message: 'Insufficient Funds',
            duration: 3000,
            position: 'top'
        });
        toast.present();

        }
        else if(res=="Added Money Successfully"){
          let toast = this.toastCtrl.create({
            message: 'Added  Money successfully',
            duration: 3000,
            position: 'top'
        });

        toast.present();

        user.resetForm();
        }



        else
        {
          let toast = this.toastCtrl.create({
            message: res,
            duration: 3000,
            position: 'top'
        });
        toast.present();

        }
      }, error => this.errorMessage = error )

    }
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddmoneyPage');
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



