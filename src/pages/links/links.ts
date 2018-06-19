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
        console.log(this.links);
        console.log(this.categoryId)
    }

    sdfsdfds() {
        console.log('sdsdjsi')
    }

    presentActionSheet(i) {

        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    //icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        console.log(this.links);

                        console.log(this.categoryId);
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


  /*  Links() {
        this.likeImg = './assets/svg/like-post-icon.svg';
        this.commentImg = './assets/icon/icon-chat1.png';
        this.viewImg = './assets/svg/speech-balloon-icon.svg';
        this._link.getLink(1)
            .subscribe(res => {


                this.links = res['data']['links']['data'];
                this.links.forEach((value) => {
                    this.create_date.push(value['created_at'])
                })
                this.create_date.forEach((value) => {
                    this.d = new Date(value);
                    this.create_day['day'] = this.d.getDate();
                    this.create_day['month'] = this.d.getMonth();
                    this.create_day['year'] = this.d.getFullYear();
                    this.create_day['minute'] = this.d.getMinutes();
                    this.create_day['hours'] = this.d.getHours();
                    this.create.push(this.create_day);

                })
                this.create.forEach((value) => {
                    if (value['year'] < this.my_date['year']) {
                        this.ago.push(this.my_date['year'] - value['year'] + ' YEARS AGO');
                    } else if (value['month'] < this.my_date['month']) {
                        this.ago.push(this.my_date['month'] - value['month'] + ' MONTHS AGO');
                    } else if (value['day'] < this.my_date['day']) {
                        this.ago.push(this.my_date['day'] - value['day'] + ' DAYS AGO');
                    } else if (value['hours'] < this.my_date['hours']) {
                        this.ago.push(this.my_date['hours'] - value['hours'] + ' HOURS AGO');
                    } else if (value['minute'] < this.my_date['minute']) {
                        this.ago.push(this.my_date['minute'] - value['minute'] + ' MINUTES AGO');
                    }
                })
                for (let i = 0; i < this.links.length; i++) {
                    this.links[i]['create_date'] = this.ago[i];
                }
                this.links.forEach((value) => {

                    value['host'] = value['url'];
                    value['host'] = value['host'].slice((value['host'].search('/') + 2), value['host'].length);
                    value['host'] = value['host'].slice(0, value['host'].search('/'))
                    value['likeImg'] = this.likeImg;
                    value['commentImg'] = this.commentImg;
                    value['viewImg'] = this.viewImg;
                })
                console.log('links');
                console.log(this.links)
            })
    }*/
}
