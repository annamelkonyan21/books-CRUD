import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {LinkProvider} from "../../providers/link/link";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {myDate} from "../blog1/blog1";

@IonicPage()
@Component({
    selector: 'page-links',
    templateUrl: 'links.html',
})
export class LinksPage {
   @Input() links : object[];
   @Input() categoryId: number;
   @Input() pageName: string;
   @Input() discussionId: number;
   @Input() openCategory: boolean;

   @Output() sendToParent = new EventEmitter();

    public likeImg:string;
    public commentImg:string;
    public viewImg:string;

    public my_date: myDate = {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    };

    public create_day: myDate = {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public actionSheetCtrl: ActionSheetController,
                private _link: LinkProvider,
                private iab: InAppBrowser) {
        this.sendToParent.emit(this.links);
    }

    ionViewDidLoad() {
        console.log('links page')
        console.log(this.links);
        console.log(this.categoryId);
        console.log(this.openCategory)
    }

    presentActionSheet(i) {

        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
             /*   {
                    text: 'Change Category',
                    handler: () => {
                        console.log('change');
                        this.openCategory = true;
                        console.log(this.openCategory)
                    }
                },*/

                {
                    text: 'Delete',
                    role: 'destructive',
                    //icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        if(this.pageName === 'BLOG1PAGE') {
                            this._link.deleteLinkFromList(this.links[i]['id'],this.categoryId)
                                .subscribe(res => {
                                    console.log(res);
                                    if (res['status'] === 'successMessage') {
                                        console.log(i);
                                        console.log(this.links.splice(i,1));
                                        console.log(this.links);
                                    }
                                })
                        } else if (this.pageName === 'DISCUSSION') {
                            this._link.deleteLinkFromDiscussionList(this.links[i]['id'],this.discussionId, this.categoryId)
                                .subscribe(res => {
                                    console.log(res);
                                    this.links.splice(i,1);
                                    console.log(this.links)
                                })
                        }

                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    openWithBrowser(url) {
        let browser = this.iab.create(url, '_blank');
        browser.on('loadstart').subscribe(event => {
            console.log("loadstart -->", event);
        }, err => {
            console.log("InAppBrowser loadstart Event Error: " + err);
        });
    }


}
