import { HttpClient } from '@angular/common/http';
import { Injectable,ViewChild } from '@angular/core';
import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import * as socketIo from 'socket.io-client';
import { Component } from '@angular/core';
import {  Nav,Platform, AlertController, App, Toast, ToastController} from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';


declare var io: {
  connect(url: string): Socket;
};

@Injectable()

export class CommonProvider {
  profile:any

 public isUserLoggedIn=false;
 serverurl: string="https://polite-parrot-43.localtunnel.me";
  socket: Socket;
  observer: any
  i:any;
  constructor( public app: App,private plt: Platform,private network: Network,
     private localNotifications: LocalNotifications,public toastCtrl:ToastController, public alertCtrl: AlertController,public http: HttpClient) {
    this.i=0;
    this.isUserLoggedIn=JSON.parse(localStorage.getItem('loggedIn')||('false'))
    this.plt.ready().then((readySource) => {
     //////=========onclick========================
      this.localNotifications.on('click').subscribe(notification=>{
         //returns view controller obj
        let view = this.app.getRootNav().getActive();
        let toast = this.toastCtrl.create({
          message: notification.title,
          duration: 3000,
          position: 'top'
        });
        toast.present();

        if((notification.title=="Sending Money")&&(view.component.name!="TransactionsPage"))
        {
          this.app.getRootNav().push('TransactionsPage');
        }
        else if((notification.title=="Money Request")&&(view.component.name!="MessagesPage"))
        {
          this.app.getRootNav().push('MessagesPage');
        }
      })
      //===============================================
    }).catch(err =>{
      console.log(err)
    });

let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
  console.log('network was disconnected :-(');
  this.disconnectsocket();
});
let connectSubscription = this.network.onConnect().subscribe(() => {
  console.log('network connected!');
  // We just got a connection but we need to wait briefly
   // before we determine the connection type. Might need to wait.
  // prior to doing any api requests as well.
  setTimeout(() => {
    if (this.network.type === 'wifi'|| this.network.type === 'ethernet'|| this.network.type === 'unknown'|| this.network.type ===  '2g'|| this.network.type === '3g' ||this.network.type ===  '4g' || this.network.type === 'cellular') {


      this.Connectsocket();
    }
  }, 3000);
});
  }
  Data:any;

  disconnectsocket(){

    this.socket.emit("disconnect","")
  }

getfinger()
{
  if(localStorage.getItem('user'))
  {
    return true;
  }
  else
  {
    return false;
  }

}
removefinger()
{
  console.log("Hiiiii")
  localStorage.removeItem('user')
  localStorage.removeItem('pass')
}

getuserpass()
{
  console.log("Username and password")
  return this.http.get(this.serverurl+'/getuserpass',{
    withCredentials: true  // <=========== important!
  })
}

getforgetpass(data)
{
  console.log("Username and password")
  return this.http.post(this.serverurl+'/getforgetpass',data,{
    withCredentials: true  // <=========== important!
  })
}

register(user){

   console.log(user)
  return this.http.post(this.serverurl+'/register', user,{
    withCredentials: true  // <=========== important!
  })
}
addbeneficiary(user){


  return this.http.post(this.serverurl+'/addbeneficiary', user,{
    withCredentials: true  // <=========== important!
  })
}

checkLogin(user){

  return this.http.post(this.serverurl+'/login', user,{
    withCredentials: true  // <=========== important!
  } )

}

getProfile()
{
  console.log("Profile common service")
  return this.http.get(this.serverurl+'/getprofile',{
    withCredentials: true  // <=========== important!
  })
}

requestmsgUpdate1(request)
{
 return this.http.post(this.serverurl+'/requestmsgUpdate1', request,{
   withCredentials: true  // <=========== important!
 })
}

//=================autorefresh===

newMessageReceived() {
  let observable = new Observable<any>(observer => {
    this.socket.on('new message', (data) => {
      console.log("data")
      console.log(data)

      observer.next(data);
    });

  });
  return observable;
}
//==============================================
////////////////////////
markasnotified(id){
  return this.http.post(this.serverurl+'/markasnotified', {id:id},{ withCredentials: true })

}

setUserLoggedIn()
{
  this.isUserLoggedIn=true;
  localStorage.setItem('loggedIn','true')

}
getUserLoggedIn()
{
   console.log("In common service")
  console.log(localStorage.getItem('loggedIn'))
  return JSON.parse(localStorage.getItem('loggedIn')||this.isUserLoggedIn.toString())
}
setUserLogout()
{
  this.isUserLoggedIn=false;
    localStorage.setItem('loggedIn','false')
}
logout(){
  console.log("Logout")
  return this.http.post(this.serverurl+'/api/logout',{},{
    withCredentials: true  // <=========== important!
  })
}
///////////////////////////////////////
viewBeneficiary(){
    return this.http.get(this.serverurl+'/viewBeneficiary',{
    withCredentials: true  // <=========== important!
  })
}
getImage(){
  const data=this.http.get(this.serverurl+'/retrievei',{
    withCredentials: true  // <=========== important!
  });
  console.log(data);
  return data

}



//================================

changePass(user){

  return this.http.post(this.serverurl+'/api/change', user,{
    withCredentials: true  // <=========== important!
  })

}




deletebeneficiary(i){

  console.log("this is from commonService"+i);
         return this.http.post(this.serverurl+'/deletebeneficiary',i,{
          withCredentials: true  // <=========== important!
        });
}


getbeneficiary(){

  return this.http.get(this.serverurl+'/getbeneficiary',{
    withCredentials: true  // <=========== important!
  })


}
//==================================
creditmoney(user){
  console.log(user)
   return this.http.post(this.serverurl+'/creditmoney', user,{
    withCredentials: true  // <=========== important!
  })
  }

  sendmoney(user){

    return this.http.post(this.serverurl+'/sending', user,{
      withCredentials: true  // <=========== important!
    })

  }

  sendmoney1(user){

    return this.http.post(this.serverurl+'/sendmoney', user,{
      withCredentials: true  // <=========== important!
    })

  }
  //===========================================
otp(user){
  console.log(user);
  return this.http.post(this.serverurl+'/sendOTP', user,{
    withCredentials: true  // <=========== important!
  })

}
requestmoney(user){
  console.log(user);
  return this.http.post(this.serverurl+'/requestmoney', user,{
    withCredentials: true  // <=========== important!
  })

}
getmessage(){
  return this.http.get(this.serverurl+'/getmessage',{
    withCredentials: true  // <=========== important!
  });

}
gethistory(){
  return this.http.post(this.serverurl+'/api/gettransactionhistory',{},{
    withCredentials: true  // <=========== important!
  });

}
addmoney(user){

  console.log("service")
 return this.http.post(this.serverurl+'/moneyyy', user,{
  withCredentials: true  // <=========== important!
})
}

verifyemail(user){

  console.log("email verification")
 return this.http.post(this.serverurl+'/verifyemail', user,{
  withCredentials: true  // <=========== important!
})
}
verifyOTPforforgotpassword(user){

  return this.http.post(this.serverurl+'/verifyOTPforforgotpassword', user,{
   withCredentials: true  // <=========== important!
 })
 }

 changeforgotpassword(user){
   console.log("hellooo")

  return this.http.post(this.serverurl+'/changeforgotpassword', user,{
   withCredentials: true  // <=========== important!
 })
 }
 sendOtp(user){

  console.log("email verification")
 return this.http.post(this.serverurl+'/forgot', user,{
  withCredentials: true  // <=========== important!
})
}
otpfun(user){
  console.log(user);
  return this.http.post(this.serverurl+'/changepasssendOTP', user,{
    withCredentials: true  // <=========== important!
  })

}


initiateReactaccount(id){
  console.log("Initiating Reactivate account");
  return this.http.post(this.serverurl+'/initiateReactaccount',{id:id},{
   withCredentials: true  // <=========== important!
 });
}
Reactaccount(otp)
{
  console.log("deactivating account");
  return this.http.post(this.serverurl+'/Reactaccount',{otp:otp},{
   withCredentials: true  // <=========== important!
 });
}


requestmsgUpdate(request)
{
 return this.http.post(this.serverurl+'/requestmsgUpdate', request,{
   withCredentials: true  // <=========== important!
 })
}
getmobilenumber(user){
  console.log(user);
  return this.http.post(this.serverurl+'/api/getmobilenumber', user,{ withCredentials: true })

}
qrscan(user){


  return this.http.post(this.serverurl+'/qrscan',user,{
    withCredentials: true  // <=========== important!
  })

  }


//--pushnotification-----------------------------------

temp=1;
  Connectsocket(): Observable<number> {
    Observable.create(observer => {
      this.observer = observer
    });

     this.socket = socketIo(this.serverurl);//==========important
    this.getProfile().subscribe(data => {
      this.profile =data
      console.log(data)
      this.socket.emit("clientdata", this.profile.mobilenumber)
    })

    this.socket.on('data', (res) => {

      console.log(res)
      this.markasnotified(res.id).subscribe(()=>{
          console.log("mark as notified")
            })


      this.observer.next(res.data);
      let data: Array<any> = [];


        data.push({
          id:this.i++,
          title: res.title,
          text: res.data,
          icon: 'file://assets/imgs/money.png'
        });


      this.localNotifications.schedule(data );

      // this._notificationService.generateNotification(data);
    });

    this.getmessage().subscribe(data => {
      var messages: any = data
      let data1: Array<any> = [];
      for (const message of messages) {
        // console.log(message)
        var status:any = '';
        if(message.value.trans_status=='success')
          status='Accepted';
        else if(message.value.trans_status=='rejected')
          status='Rejected'
        else if(message.value.trans_status=='canceled')
          status='Canceled'


          if(message.value.isnotified==false && message.value.trans_status=='pending' && message.value.to == this.profile.mobilenumber && message.value.type=="moneyrequest")
          {

            data1.push({
              id:this.i++,
              title: 'Money Request',
              text: message.value.fromname+"("+message.value.from + ") sent you a money request.",
              icon: 'file://assets/imgs/money.png'
              // text: message.value.requestername + "(" + message.value.mobilenumber + ") sent you a money request"
            });


        }
        else if(message.value.isnotified==false && message.value.trans_status=='pending' && message.value.to == this.profile.mobilenumber && message.value.type=="sending")
        {

          data1.push({
            id:this.i++,
            title: 'Sending Money',
            text: message.value.fromname+"("+message.value.from + ") wants to send you money.",
            icon: 'file://assets/imgs/money.png'
            // text: message.value.requestername + "(" + message.value.mobilenumber + ") sent you a money request"
          });

        }

        else if(message.value.isnotified==false && message.value.trans_status!='pending' && message.value.from == this.profile.mobilenumber && message.value.type=="moneyrequest")
        {
          data1.push({
            id:this.i++,
            title:  'Money Request',
            text: message.value.toname+"("+message.value.to + ")"+ status + " your money request.",
            icon: 'file://assets/imgs/money.png'
            // text: message.value.requestername + "(" + message.value.mobilenumber + ") sent you a money request"
          });
        }

        else if(message.value.isnotified==false && message.value.trans_status!='pending' && message.value.from == this.profile.mobilenumber && message.value.type=="sending")
        {
          data1.push({
            id:this.i++,
            title:  'Money Request',
            text: message.value.toname+"("+message.value.to + ")"+ status + " your money.",
            icon: 'file://assets/imgs/money.png'
            // text: message.value.requestername + "(" + message.value.mobilenumber + ") sent you a money request"
          });

        }

        else if(message.value.isnotified==false && message.value.trans_status=='canceled' && message.value.to == this.profile.mobilenumber && message.value.type=="moneyrequest")
        {

          data1.push({
            id:this.i++,
            title:  'Money Request',
            text: message.value.fromname+"("+message.value.from + ") has"+ status + " this money request.",
            icon: 'file://assets/imgs/money.png'
            // text: message.value.requestername + "(" + message.value.mobilenumber + ") sent you a money request"
          });

        }

      }
      this.localNotifications.schedule(data1 );

    });
    // this.gethistory().subscribe(data => {
    //   var messages: any = data
    //   let data1: Array<any> = [];
    //   for (const message of messages) {
    //     console.log(message)
    //     if(message.isnotified==false  && message.to==this.profile.mobilenumber)
    //     {

    //         data1.push({
    //           id:this.i++,
    //           title : 'Received Money',
    //           text: message.fromname +"("+message.from + ") sent you money ₹ " + message.transferamount,
    //           icon: 'file://assets/imgs/money.png'
    //           // text: message.fromname + "(" + message.from + ") sent you money ₹" + message.transferamount


    //         });



    //     }
    //   }
    //   this.localNotifications.schedule(data1 );

    // });

    return this.createObservable();
  }


  createObservable(): Observable<number> {
    return new Observable<number>(observer => {
      this.observer = observer;
    });
  }

  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      let errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }


}

// stop connect watch
// connectSubscription.unsubscribe();




export interface Socket {
  on(event: string, callback: (data: any) => void);
  emit(event: string, data: any);
}
