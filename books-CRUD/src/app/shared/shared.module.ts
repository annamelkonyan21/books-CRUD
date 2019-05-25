import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {GridModule} from '@progress/kendo-angular-grid';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';
import {DateInputsModule} from '@progress/kendo-angular-dateinputs';
import {PopupModule} from '@progress/kendo-angular-popup';
import {NotificationModule} from '@progress/kendo-angular-notification';
import {ButtonsModule} from '@progress/kendo-angular-buttons';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    GridModule,
    BrowserAnimationsModule,
    FormsModule,
    DropDownsModule,
    DateInputsModule,
    PopupModule,
    NotificationModule,
    ButtonsModule,
  ],
  exports: [
    HttpClientModule,
    GridModule,
    BrowserAnimationsModule,
    FormsModule,
    DropDownsModule,
    DateInputsModule,
    PopupModule,
    NotificationModule,
    ButtonsModule,
  ],
  declarations: []
})
export class SharedModule { }
