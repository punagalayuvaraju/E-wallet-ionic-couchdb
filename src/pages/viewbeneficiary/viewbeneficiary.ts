import { Component,ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Subject } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-viewbeneficiary',
  templateUrl: 'viewbeneficiary.html',
})
export class ViewbeneficiaryPage implements OnInit{


items:Array<any>;
name='';
mobileno='';
spin=false;
loading:any;

  beneficiaryData:any;

  checkm=false;
  constructor(public plt:Platform,public loadingCtrl: LoadingController,public navParams: NavParams,public alertCtrl:AlertController ,private newService :CommonProvider,public navCtrl:NavController,public toastCtrl:ToastController) {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop({animation:"ios-transition"});
      }
      else{
        this.plt.exitApp();
      }

      backAction();
    },1)
    // ++++++++++++++++++++++++++++++++++++++++++++++
    this.initializeItems();
    this.name=navParams.get('name');
    this.mobileno=navParams.get('mobileno');
      // ++++++++++++++++++++++++++++++++++++++++++++++++++

}


ngOnInit(){

 // ============================

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

      this.newService.getbeneficiary().subscribe(data => {
        //===========================
        this.loading.dismiss();
        this.loading=null;


  //===========================

        console.log("Beneficiary Data");
        this.beneficiaryData = data;
          // ===================================
          this.items=this.beneficiaryData;
          // ====================================
        if(this.beneficiaryData.length==0)
          {
            this.checkm=true;
            console.log("No Beneficiary's");
          }

        console.log(this.beneficiaryData);



      });
    }
  });
}



   //Delete the Beneficiary
   delete = function (i) {



     console.log(i)
     const confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure to delete your beneficiary?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');

                // ============================
this.loading = this.loadingCtrl.create({
  spinner: 'bubbles',
});

this.loading.present();
//====================================

            this.newService.deletebeneficiary(i)
            .subscribe(data => {
               //======================
      this.loading.dismiss();
      this.loading=null;

      //================================
              var result=data;
              if(result.res!="error")
              {
                console.log("deleted");
                this.newService.getbeneficiary().subscribe(beneficiary =>  {this.beneficiaryData = beneficiary;
                  this.items=this.beneficiaryData;
                  if(this.beneficiaryData.length==0)
                  {
                    this.checkm=true;
                    console.log("No Beneficiary's");
                  }
                  else{
                    this.checkm=false;
                  }
                });
                let toast = this.toastCtrl.create({
                  message: 'Deleted successfully',
                  duration: 3000,
                  position: 'top'
              });
              toast.present();

                console.log(this.beneficiaryData.length);

              }
              else{
                let toast = this.toastCtrl.create({
                  message: result.res,
                  duration: 3000,
                  position: 'top'
              });
              toast.present();

            }

            }, error => this.errorMessage = error);

          }
        }

      ]

    });
    confirm.present();


  }
// +++++++++++++++++++++++++++++++++++++++++++++++++++

    initializeItems() {
      this.items=this.beneficiaryData;
     }

     getItems(ev: any) {
       // Reset items back to all of the items
       this.initializeItems();

       // set val to the value of the searchbar
       const val = ev.target.value;

       // if the value is an empty string don't filter the items
       if (val && val.trim() != '') {
         this.items = this.items.filter((item) => {
           return ((item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
         ((item.mobileno.toLowerCase().indexOf(val.toLowerCase()) > -1))
       )

         })
         console.log(this.items);
       }
     }
       // ++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++
doRefresh(refresher) {
  console.log('Begin async operation', refresher);

  this.newService.getbeneficiary().subscribe(data => {
    console.log("Beneficiary Data");
    this.beneficiaryData = data;
    this.items=this.beneficiaryData;
// ===================
    refresher.complete();
// ==========
    if(this.beneficiaryData.length==0)
      {
        this.checkm=true;
        console.log("No Beneficiary's");
      }

    console.log(this.beneficiaryData);



  });
}
// ++++++++++++++++++++++++++++++++++






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



  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewbeneficiaryPage');
  }


  ionViewCanLeave(){
    if(this.loading)
    {
      this.loading.dismiss();
    }
   }
}
