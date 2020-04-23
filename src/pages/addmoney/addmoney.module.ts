import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddmoneyPage } from './addmoney';

@NgModule({
  declarations: [
    AddmoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(AddmoneyPage),
  ],
})
export class AddmoneyPageModule {}
