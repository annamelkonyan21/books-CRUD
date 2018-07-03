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
    @Input() links:object[];
    @Input() categoryId:number;
    @Input() pageName:string;
    @Input() discussionId:number;
    @Input() openCategory:boolean;
    @Input() changeCategory:boolean;
  //      @Input() linkId:number;

    @Output() sendToParent = new EventEmitter();

    @Output() onDatePicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() onChangeCategories: EventEmitter<any> = new EventEmitter<any>();
    @Output() onLinkId: EventEmitter<any> = new EventEmitter<any>();

    public pickDate(date: any): void {
        this.onDatePicked.emit(date);
    }

   public onChangeCategory(date: any): void {
        this.onChangeCategories.emit(date);
   }

    public onLinkID(id){
        console.log('link id is here');

        this.onLinkId.emit(id);
    }

    public opened: boolean = false;

    public likeImg: string;
    public commentImg: string;
    public viewImg: string;

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



    public linkId:number;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public actionSheetCtrl: ActionSheetController,
                private _link: LinkProvider,
                private iab: InAppBrowser) {
        this.sendToParent.emit(this.links);

    }

    ionViewDidLoad() {

    }

    ngOnInit() {


    }

    presentActionSheet(i,event) {
       // this.linkId = this.links[i]['id'];
        this.changeCategory = false ;
        //console.log(this.links[i]['id'])
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Change Category',
                    handler: () => {
                     //   console.log('link')
                     //   console.log(this.links[i]['id'])
                        this.linkId = this.links[i]['id'];
                        this.changeCategory = true;
                        this.openCategory = !this.openCategory;
                        this.pickDate(this.openCategory);
                        this.onChangeCategory(this.changeCategory);
                        this.onLinkID(this.linkId);
                        if (this.openCategory) {
                            console.log('open');
                        } else {
                            console.log('close');
                        }

                        if(this.changeCategory) {
                            console.log('change')
                        } else {
                            console.log('does not change')
                        }

                    }
                },

                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        if (this.pageName === 'BLOG1PAGE') {
                            this._link.deleteLinkFromList(this.links[i]['id']   , this.categoryId)
                                .subscribe(res => {
                                    console.log(res);
                                    if (res['status'] === 'successMessage') {
                                        console.log(this.links);
                                    }
                                })
                        } else if (this.pageName === 'DISCUSSION') {
                            this._link.deleteLinkFromDiscussionList(this.links[i]['id'], this.discussionId, this.categoryId)
                                .subscribe(res => {
                                    this.links.splice(i, 1);
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


