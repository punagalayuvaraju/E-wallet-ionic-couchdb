import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DialogboxPage } from './dialogbox';

@NgModule({
  declarations: [
    DialogboxPage,
  ],
  imports: [
    IonicPageModule.forChild(DialogboxPage),
  ],
})
export class DialogboxPageModule {}
