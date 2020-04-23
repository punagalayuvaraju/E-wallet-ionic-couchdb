import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController,Platform } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Subject } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage  {

  checkm=false;
  // addmoney='add Money';
  // sendmoney='sending Money';
  // addfailed="add Money failed";
  transactionData:any;
  Profiledata:any;
  beneficiaryData:any;
  loading : any;
  message:any;


    // ================================
items:Array<any>;
toname='';
to='';
transferamount='';
timestamp='';
fromname='';
from='';
id='';
// ======================================

constructor(public plt:Platform,public loadingCtrl: LoadingController ,public alertCtrl:AlertController,private newService :CommonProvider, public navCtrl: NavController, public navParams: NavParams,public toastCtrl:ToastController) {
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
this.toname=navParams.get('toname');
this.transferamount=navParams.get('transferamount');
this.timestamp=navParams.get('timestamp');
this.fromname=navParams.get('fromname');
this.from=navParams.get('from');
this.id=navParams.get('id');

// ++++++++++++++++++++++++++++++++++++++++++++++++++

this.newService.newMessageReceived()
.subscribe(data => {
console.log("newmessage")



this.newService.gethistory().subscribe(data => {
this.transactionData = data;
    // ===================================
this.items=this.transactionData;
// ====================================
console.log(this.transactionData)
if(this.transactionData.length==0)
{
  this.checkm=true;
  console.log("No Beneficiary's");
}
else
    {
      this.checkm = false;

    }

});
})
}





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

      this.newService.getProfile().subscribe(data => {
        this.Profiledata = data
        console.log(this.Profiledata.mobilenumber);
      });
      this.newService.getbeneficiary().subscribe(data => {
        console.log("Beneficiary Data");
        this.beneficiaryData = data;
        console.log(this.beneficiaryData);


      });

  this.newService.gethistory().subscribe(data => {

    //===========================
    this.loading.dismiss();
    this.loading=null;


    //===========================

    this.transactionData = data;
        // ===================================
  this.items=this.transactionData;
  // ====================================
    console.log(this.transactionData)
    if(this.transactionData.length==0)
    {
      this.checkm=true;
      console.log("No Beneficiary's");
    }


    });

// //getmessages------
// this.newService.getmessage().subscribe(data =>{
//   this.message = data
// });

//----------------------


    }
  });
}


  // ngOnInit() {
  //   this.newService.getProfile().subscribe(data => {
  //     this.Profiledata = data
  //     console.log(this.Profiledata.mobilenumber);
  //   });
  //   this.newService.getbeneficiary().subscribe(data => {
  //     console.log("Beneficiary Data");
  //     this.beneficiaryData = data;
  //     console.log(this.beneficiaryData);


  //   });
  // }
 // +++++++++++++++++++++++++++++++++++++++++++++++++++


initializeItems() {
  this.items=this.transactionData;
 }

 getItems(ev: any) {
   // Reset items back to all of the items
   this.initializeItems();

   // set val to the value of the searchbar
   const val = ev.target.value;

   // if the value is an empty string don't filter the items
   if (val && val.trim() != '') {
     this.items = this.items.filter((item) => {
      console.log(this.items);

       return ((item.toname.toLowerCase().indexOf(val.toLowerCase()) > -1)||
       ((item.to.toLowerCase().indexOf(val.toLowerCase()) > -1))||
     ((item.transferamount.toString().indexOf(val.toString()) > -1)) ||
     ((item.timestamp.toLowerCase().indexOf(val.toLowerCase()) > -1))||
     ((item.fromname.toLowerCase().indexOf(val.toLowerCase()) > -1)) ||
     ((item.from.toLowerCase().indexOf(val.toLowerCase()) > -1))||
     ((item.id.toLowerCase().indexOf(val.toLowerCase()) > -1))


     )

     })
   }
 }
   // ++++++++++++++++++++++++++++++++++++++++++++++++++++++
 // ++++++++++++++++++++++++++++++
doRefresh(refresher) {
  console.log('Begin async operation', refresher);

  this.newService.gethistory().subscribe(data => {
    this.transactionData = data;
        // ===================================
  this.items=this.transactionData;
  // ====================================
  refresher.complete();
    console.log(this.transactionData)
    if(this.transactionData.length==0)
    {
      this.checkm=true;
      console.log("No Beneficiary's");
    }

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
    console.log('ionViewDidLoad TransactionsPage');
  }




  ionViewCanLeave(){
    if(this.loading)
    {
      this.loading.dismiss();
    }
   }
}




