import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CachedResourceLoader } from '@angular/platform-browser-dynamic/src/resource_loader/resource_loader_cache';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage implements OnInit {

// clicked21=false;
// clicked22=false;
// clicked23=false;
loader:any;
loading:any;

  // ================================
items:Array<any>;
requesternickname='';
amount='';
mobilenumber='';
timestamp='';
beneficiaryac='';
data1:any;
// ======================================

  constructor(public plt:Platform,public loadingCtrl: LoadingController ,public alertCtrl:AlertController,public newService: CommonProvider,public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams) {
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
this.requesternickname=navParams.get('requesternickname');
this.amount=navParams.get('amount');
this.mobilenumber=navParams.get('mobilenumber');
this.timestamp=navParams.get('timestamp');
this.beneficiaryac=navParams.get('beneficiaryac');

  // ++++++++++++++++++++++++++++++++++++++++++++++++++



  this.newService.newMessageReceived()
  .subscribe(data => {
console.log("newmessage")


    this.newService.getmessage().subscribe(data =>{
      this.message = data
      console.log(this.message)
      // ===================================
      this.items=this.message;
      // ====================================

    if(this.message.length==0)
    {
      this.checkm=true
      console.log("No messsages");
    }
    else
    {
      this.checkm = false;
    }

    });


})



  }

  message:any
  checkm:boolean=false
  Profiledata;



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

        this.newService.getmessage().subscribe(data =>{
          //==================
          this.loading.dismiss();
          this.loading=null;

          //==================
          this.message = data
          console.log(this.message)
          // ===================================
          this.items=this.message;
          // ====================================

        if(this.message.length==0)
        {
          this.checkm=true
          console.log("No messsages");
        }


        });

      }
    });


}


// =======================accept/reject===================
beneficiarylist: any
existingbeneficiary = null
res: any
sendmoneyres: any


acceptrequest=function(requester)
  {
    // ============================

this.loading = this.loadingCtrl.create({
  spinner: 'bubbles',
});

this.loading.present();
//====================================

    // this.clicked23=true;

    console.log("accepted request...")
    console.log(requester.id)
    this.newService.getbeneficiary().subscribe(data => {

      console.log("Getting ben list")
      console.log(data)
      this.beneficiarylist = data;
      console.log("checking for already in beneficiary list")
      for (let i = 0; i < this.beneficiarylist.length; i++) {
        if (this.beneficiarylist[i].mobileno == requester.value.from) {
          this.existingbeneficiary = this.beneficiarylist[i].id;
        }
      }
      if (this.existingbeneficiary != null) {
        console.log("initiating transaction...");
        // add to beneficiary and sendotp
        this.newService.getProfile().subscribe(data => {




          this.Profiledata = data
          if (this.Profiledata.message == "sessionexpired")
          {
            this.loading.dismiss();
            this.loading=null;
            this.newService.setUserLogout();
            let toast = this.toastCtrl.create({
              message: 'Your session is expired... please login again to continue.',
              duration: 3000,
              position: 'top'
            });
            toast.present();
            // this.clicked23=false;


            this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
          }
          else
          {
            if (requester.value.In <= this.Profiledata.walletamount && requester.value.In <= this.Profiledata.ledger)

            // if (requester.value.amount <= this.Profiledata.walletamount)
            {
             var beneficiarydata={beneficiaryac:this.existingbeneficiary}

              this.newService.otp(beneficiarydata)
                .subscribe(data => {


                  this.res = data
                  console.log(this.res)


                  if (this.res.res == "success")
                  {
                    this.Sendmoney(requester)
                  }

                  else if (this.res.res == "blocked user") {
                    this.loading.dismiss();
                    this.loading=null;
                    let toast = this.toastCtrl.create({
                      message: 'Requester account is blocked...',
                      duration: 3000,
                      position: 'top'
                    });
                    toast.present();

                  }
                });

            }
            else
            {
              this.loading.dismiss();
              this.loading=null;
              let toast = this.toastCtrl.create({
                message: 'Insufficient Funds',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              // this.clicked23=false;






            }

          }

        });

      }
      else
      {
        const beneficiary = {
          name: requester.value.requesternickname,
          mno: requester.value.from
        }
        this.newService.addbeneficiary(beneficiary).subscribe( data => {

          this.loading.dismiss();



         this.res=data;
          console.log(this.res.res)
          if(this.res.res=="failed")
          {
            let toast = this.toastCtrl.create({
              message: 'This Beneficiary already existed',
              duration: 3000,
              position: 'top'
            });
            toast.present();
            // this.clicked23=false;


          }
          else if(this.res.res=="success")
          {

            let toast = this.toastCtrl.create({
              message: 'Added Beneficiary successfully',
              duration: 3000,
              position: 'top'
            });
            toast.present();
            // this.clicked23=false;


            this.acceptrequest(requester)
          }
          else if(this.res.res=="Beneficiary mobilenumber not existed")
          {
            let toast = this.toastCtrl.create({
              message: 'Beneficiary mobilenumber not existed',
              duration: 3000,
              position: 'top'
            });
            toast.present();
            // this.clicked23=false;


          }

          else {
            let toast = this.toastCtrl.create({
              message: 'Error....try again later',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });

      }
    })
}


cancelrequest=function(request)
{
  // ============================


  this.loading = this.loadingCtrl.create({
    spinner: 'bubbles',
  });

  this.loading.present();

//====================================
  // this.clicked21=true;
  const requestdoc = { id: request.id, trans_status: "canceled",to:request.value.to,from:request.value.from,fromname:request.value.fromname,toname:request.value.toname }

  this.newService.requestmsgUpdate1(requestdoc).subscribe(data => {
     //==========================

     this.loading.dismiss();
     //==========================
    this.res = data;
    if (this.res.result == "success")
    {
      let toast = this.toastCtrl.create({
        message: 'You canceled the request successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.clicked21=false;
      // this.ngOnInit();
    }
    else
    {
      // alert(this.res.result);
      let toast = this.toastCtrl.create({
        message:this.res.result,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.clicked21=false;

    }
  });
}


addTodoInput;
Sendmoney=function(requester)
{


  // this.clicked23=false;


   //==========================
this.loading.dismiss();
this.loading=null;
   //==========================
 //==========================

  let addTodoAlert= this.alertCtrl.create({
    subTitle:"Enter your OTP",
    inputs:[
      {
  type:"text",
  name:"addTodoInput"
      }],

    buttons:[
      {
        text:"Submit",
        handler:(inputData)=>{



          this.loading = this.loadingCtrl.create({
            spinner: 'bubbles',
          });

          this.loading.present();

       this.addTodoInput=inputData.addTodoInput;
        //  this.todos.push(addTodoInput)\
        console.log(this.addTodoInput);
        if (this.addTodoInput)
              {
                const transactiondata = {
                  beneficiaryac1: this.existingbeneficiary,
                  amount1: requester.value.In,
                  id:requester.value.id,

                  otp: this.addTodoInput,
                  comment1: "Request accepted: " + requester.value.comment
                }
                this.newService.sendmoney1(transactiondata).subscribe(data => {
                  console.log(data)
                  this.loading.dismiss();
                  this.loading=null;
                  this.sendmoneyres = data;

                  if (this.sendmoneyres.res == "send")
                  {
                    let toast = this.toastCtrl.create({
                      message: 'amount sended successfully',
                      duration: 3000,
                      position: 'top'
                    });
                    toast.present();
                    const requestdoc = { id: requester.id, decision: "accepted" }
                    console.log(requestdoc)
                    // this.newService.requestmsgUpdate(requestdoc).subscribe(data => {
                    //   this.res = data;
                    //   if (this.res.result == "success")
                    //   {

                    //     this.ngOnInit();
                    //   }
                    //   else
                    //   {
                    //     let toast = this.toastCtrl.create({
                    //       message: this.res.result,
                    //       duration: 3000,
                    //       position: 'top'
                    //     });
                    //     toast.present();
                    //   }
                    // });
                  }
                  else if (this.sendmoneyres.res == "OTPWRONG")
                  {

                    // alert("Incorrect OTP");
                    let toast = this.toastCtrl.create({
                      message: 'Incorrect OTP',
                      duration: 3000,
                      position: 'top'
                    });
                    toast.present();
                    this.Sendmoney(requester);


                  }
                  else if(this.sendmoneyres.res == "block")
          {
            let toast = this.toastCtrl.create({
              message: 'Your account is blocked',
              duration: 3000,
              position: 'top'
            });
            toast.present();

            this.newService.logout().subscribe(data => {
            this.data1=data
              if(this.data1.res=="loggedout" ||this.data1.message=="sessionexpired")
              {
                this.newService.setUserLogout();
                this.navCtrl.setRoot('HomePage',null, {animation:"ios-transition"});
              }

            });

          }
                  else if (this.sendmoneyres.res == "OTP-expired") {
                    let toast = this.toastCtrl.create({
                      message: 'OTP expired',
                      duration: 3000,
                      position: 'top'
                    });
                    toast.present();
                  }
                })
              }

       }
      },
      {
        text:"Cancel"
        }]
  });
  addTodoAlert.present()
}

/////////////////////////////////////////////////////////////////////////////
declinerequest(requester)
{
  // ============================


  this.loading = this.loadingCtrl.create({
    spinner: 'bubbles',
  });

  this.loading.present();

//====================================
  // this.clicked22=true;

  const requestdoc = { id: requester.id, trans_status: "rejected",to:requester.value.to,from:requester.value.from,In:requester.value.In,fromname:requester.value.fromname,toname:requester.value.toname }
  this.newService.requestmsgUpdate(requestdoc).subscribe(data => {
     //==========================

     this.loading.dismiss();
     this.loading=null;
     //==========================
    this.res = data;
    if (this.res.result == "success")
    {
      // alert("Rejected the request successfully");
      let toast = this.toastCtrl.create({
        message: 'Rejected the request successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.clicked22=false;

      // this.ngOnInit();
    }
    else
    {
      // alert(this.res.result);
      let toast = this.toastCtrl.create({
        message: this.res.result,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.clicked22=false;


    }
  });
}

//////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
declinerequest1(requester)
{
  // ============================


  this.loading = this.loadingCtrl.create({
    spinner: 'bubbles',
  });

  this.loading.present();

//====================================
  // this.clicked22=true;

  const requestdoc = { id: requester.id, trans_status: "rejected",to:requester.value.to,from:requester.value.from,In:requester.value.In,fromname:requester.value.fromname,toname:requester.value.toname }
  this.newService.requestmsgUpdate1(requestdoc).subscribe(data => {
     //==========================

     this.loading.dismiss();
     this.loading=null;

     //==========================
    this.res = data;
    if (this.res.result == "success")
    {
      // alert("Rejected the request successfully");
      let toast = this.toastCtrl.create({
        message: 'Rejected the request successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.clicked22=false;

      // this.ngOnInit();
    }
    else
    {
      // alert(this.res.result);
      let toast = this.toastCtrl.create({
        message: this.res.result,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.clicked22=false;


    }
  });
}

////===-----------------------------------
addTodoInput1;
take=function(requester)
{

  this.newService.getbeneficiary().subscribe(data => {
console.log(this.beneficiarylist)
    this.beneficiarylist = data;

    for (let i = 0; i < this.beneficiarylist.length; i++)
    {
      if (this.beneficiarylist[i].mobileno == requester.value.from)
      {
        this.existingbeneficiary = this.beneficiarylist[i].id;

      }
    }
    if (this.existingbeneficiary != null) {
      console.log(this.existingbeneficiary)
          var beneficiarydata = { to: this.existingbeneficiary }
          this.newService.creditmoney(requester)
            .subscribe(data => {
              this.sendmoneyres = data;

              if (this.sendmoneyres.res == "send") {
                // alert("Amount sent successf");
                const requestdoc = { id: requester.id, trans_status: "accepted" }

                // this.newService.requestmsgUpdate(requestdoc).subscribe(data => {
                //   this.res = data;
                //   if (this.res.result == "success") {

                //     this.ngOnInit();
                //   }
                //   else {

                //     let toast = this.toastCtrl.create({
                //       message: this.res.result,
                //       duration: 3000,
                //       position: 'top'
                //     });
                //     toast.present();
                //     alert(this.res.result);
                //   }
                // });
              }
              else{
                let toast = this.toastCtrl.create({
                  message: this.sendmoneyres.res,
                  duration: 3000,
                  position: 'top'
                });
                toast.present();

              }

            })
        }

        else
        {

          const beneficiary = {
            name: requester.value.requesternickname,
            mno: requester.value.from
          }
          console.log(beneficiary)
          this.newService.addbeneficiary(beneficiary).subscribe( data => {
           this.res=data;

            if(this.res.res=="failed")
            {
              let toast = this.toastCtrl.create({
                message: "Failed...Try it later",
                duration: 3000,
                position: 'top'
              });
              toast.present();

            }
            else if(this.res.res=="success")
            {
              let toast = this.toastCtrl.create({
                message: "Added beneficiary",
                duration: 3000,
                position: 'top'
              });
              toast.present();
              console.log(beneficiary);
             this.take(requester);

             console.log(requester);



            }
            else if(this.res.res=="Beneficiary mobilenumber not existed")
            {
              let toast = this.toastCtrl.create({
                message: "Beneficiary mobilenumber not existed",
                duration: 3000,
                position: 'top'
              });
              toast.present();
            }
            else
            {

              let toast = this.toastCtrl.create({
                message: "Error....try again later",
                duration: 3000,
                position: 'top'
              });
              toast.present();
            }
          });




        }

      })
  }
//=======================
// ===============================================

    // +++++++++++++++++++++++++++++++++++++++++++++++++++

initializeItems() {
 this.items=this.message;
}

getItems(ev: any) {
  // Reset items back to all of the items
  this.initializeItems();

  // set val to the value of the searchbar
  const val = ev.target.value;

  // if the value is an empty string don't filter the items
  if (val && val.trim() != '') {
    this.items = this.items.filter((item) => {
      return ((item.value.requesternickname.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
    ((item.value.amount.toString().indexOf(val.toString()) > -1))||
    ((item.value.mobilenumber.toLowerCase().indexOf(val.toLowerCase()) > -1)) ||
    ((item.value.timestamp.toString().indexOf(val.toString()) > -1))||
    ((item.value.beneficiaryac.toString().indexOf(val.toString()) > -1))

  )

    })
    console.log(this.items);
  }
}
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++


  // ++++++++++++++++++++++++++++++
doRefresh(refresher) {
  console.log('Begin async operation', refresher);
  this.newService.getmessage().subscribe(data =>{
    this.message = data

    this.items=this.message;
  refresher.complete();
  if(this.message.length==0)
  {
    this.checkm=true
    console.log("No messsages");
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
    console.log('ionViewDidLoad MessagesPage');
  }
  ionViewCanLeave(){
    if(this.loading)
    {
      this.loading.dismiss();
    }
   }

}





