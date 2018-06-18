import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Blog1Page } from './blog1';

import {LinksPageModule} from "../links/links.module";

@NgModule({
  declarations: [
    Blog1Page,
  ],
  imports: [
    IonicPageModule.forChild(Blog1Page),
     LinksPageModule
  ],

})
export class Blog1PageModule {}
