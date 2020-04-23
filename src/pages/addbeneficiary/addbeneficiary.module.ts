import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddbeneficiaryPage } from './addbeneficiary';

@NgModule({
  declarations: [
    AddbeneficiaryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddbeneficiaryPage),
  ],
})
export class AddbeneficiaryPageModule {}
