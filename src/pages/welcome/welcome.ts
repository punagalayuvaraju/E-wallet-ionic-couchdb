import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,AlertController,Platform ,MenuController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  // pages: Array<{title: string, component: any}>;
  message:any;
  count:any=0;
  a:any=0;
  counter:any=0;
  constructor(public menuCtrl: MenuController,public plt:Platform,public alertCtrl: AlertController,private newService: CommonProvider,private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController) {
    let backAction =  this.plt.registerBackButtonAction(() => {
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop({animation:"ios-transition"});
      }
      else if(localStorage.getItem('menuopen')=="true"){
        this.menuCtrl.close();
      }
      else {
        this.plt.exitApp();
      }
      backAction();
    },1)

    this.newService.newMessageReceived()
    .subscribe(data => {
  console.log("newmessage")


      this.newService.getmessage().subscribe(data =>{
        this.message = data
        console.log(this.message)

        this.newService.getProfile().subscribe(data => {
          const Profiledata: any = data

          if(this.message.length==0)
        {
          console.log("No messsages");
        }
        else
        {
          this.count=0;

         for(let i=0;i<this.message.length;i++)
         {
          // if(this.message[i].value.trans_status=='pending')
          if((this.message[i].value.trans_status=='pending' &&Profiledata.mobilenumber==this.message[i].value.to &&this.message[i].value.type=='sending' )||
          (this.message[i].value.trans_status=='pending' && Profiledata.mobilenumber==this.message[i].value.to  && this.message[i].value.type=='moneyrequest'))

          {
            this.count++;
          console.log("pradiiiiiiii");
          }
         }



        }

        });
        // ===================================
        // ====================================


      });


  })


  }


  ngOnInit(){
    this.newService.getProfile().subscribe(data => {
      const Profiledata :any=data
      console.log(Profiledata);
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
      else{


        this.newService.getmessage().subscribe(data =>{
          this.message = data

    console.log("pradimsg");
        if(this.message.length==0)
        {
          console.log("No messsages");
        }
        else
        {
          this.count=0;
         for(let i=0;i<this.message.length;i++)
         {
          // if(this.message[i].value.trans_status=='pending')
          // console.log(Profiledata);


 if((this.message[i].value.trans_status=='pending' && Profiledata.mobilenumber==this.message[i].value.to &&this.message[i].value.type=='sending' )||
         (this.message[i].value.trans_status=='pending' && Profiledata.mobilenumber==this.message[i].value.to  && this.message[i].value.type=='moneyrequest'))


          // if((this.message[i].value.trans_status=="pending" && this.message[i].value.to==Profiledata.mobilenumber && this.message[i].from!=Profiledata.mobilenumber && this.message[i].value.type=='moneyrequest')||
          // (this.message[i].value.trans_status=="pending" && this.message[i].value.to==Profiledata.mobilenumber&& this.message[i].value.type=='sending') )
          {
            this.count++;
            console.log(this.count);
          console.log(this.a);
          }



         }

         console.log(this.count);
         console.log(this.a);

        }

        });


      }
    });
}

  openpage(pager)
  {
this.navCtrl.push(pager,null, {animation:"ios-transition"})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
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




}

