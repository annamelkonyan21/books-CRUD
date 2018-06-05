import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {MyApp} from './app.component';

//--------- modules ------------

import {HomeModule} from "../pages/home/home.module";
import {Blog1PageModule} from "../pages/blog1/blog1.module";
import { Page1PageModule} from "../pages/page1/page1.module";
import { Tab1PageModule} from "../pages/tab1/tab1.module";
import { Tab2PageModule} from "../pages/tab2/tab2.module";
import { MenuPageModule} from "../pages/menu/menu.module";

//--------- providers ------------

import {ApiProvider} from '../providers/api';
import {InterceptorProvider} from '../providers/interceptor';
import {HomeProvider} from "../providers/home/home";
import {LinkProvider} from '../providers/link/link';

//--------- plugin --------------
import { Facebook } from "@ionic-native/facebook";


@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        HomeModule,
        Blog1PageModule,
        Page1PageModule,
        Tab1PageModule,
        Tab2PageModule,
        MenuPageModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true},
        ApiProvider,
        HomeProvider,
        LinkProvider,
        //------ plugin --------
        Facebook
    ]
})
export class AppModule {
}
