import {Component, ViewChild} from '@angular/core';
import {
    AlertController, IonicPage, LoadingController, MenuController, NavController, NavParams,
    Platform
} from 'ionic-angular';
import {HomePage} from "../home/home";
import {LinkProvider} from "../../providers/link/link";
import {ActionSheetController} from 'ionic-angular';
import {InAppBrowser} from '@ionic-native/in-app-browser';


export interface myDate {
    day: number,
    month: number,
    year: number,
    minute: number,
    hours: number
}

@IonicPage()
@Component({
    selector: 'page-blog1',
    templateUrl: 'blog1.html',
    providers: [LinkProvider, InAppBrowser]
})

export class Blog1Page {
    public links: any;
    public users: any;
    isAndroid: boolean;
    searchOpen: boolean = false;
    @ViewChild('search') search;
    @ViewChild('select') select;
    create_date = [];
    create = [];
    Dat: Date = new Date();
    my_date: myDate = {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    };

    create_day: myDate = {
        day: null,
        month: null,
        year: null,
        minute: null,
        hours: null
    }

    d: any;
    ago = [];
    urles = [];
    chats = [];
    openFreind: boolean = false;
    openSearchBar: boolean = false;
    openChat: boolean = false;
    openNotificationBar: boolean = false;
    categories = [];
    categoryValue: any;
    data = {
        categories: []
    };
    openCategory: boolean = false;
    categoryName: string = '';
    categoryId: number;
    categoryI: number;
    openLinks: boolean = false;
    likeImg: string = 'assets/svg/like-post-icon.svg';
    commentImg: string = 'assets/icon/icon-chat1.png';
    viewImg: string = 'assets/svg/speech-balloon-icon.svg';
    pos:boolean = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public _link: LinkProvider,
                public menu: MenuController,
                public platform: Platform,
                public actionSheetCtrl: ActionSheetController,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public iab: InAppBrowser) {
        this.isAndroid = platform.is('android');
    }


    doRefresh(refresher) {
        this.pos = true;
        console.log(this.categoryName)
        if (this.categoryName === '' || this.categoryName === 'All Categories') {
            this.pos = true;
            this.Links();
        } else {
            this.pos = true;
            this.getLinkByCategoryName(this.categoryId);
        }
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

    ionViewDidLoad() {
        if (localStorage.getItem('token') === null) {
            this.navCtrl.push(HomePage);
        }
        this.Links();
        this.Users();
        this.my_date['day'] = this.Dat.getDate();
        this.my_date['month'] = this.Dat.getMonth();
        this.my_date['year'] = this.Dat.getFullYear();
        this.my_date['minute'] = this.Dat.getMinutes();
        this.my_date['hours'] = this.Dat.getHours();
    }

    Links() {
        this._link.getLink()
            .subscribe(res => {
                this.links = res['data'].links;
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
                    value.host = value.url;
                    value.host = value.host.slice((value.host.search('/') + 2), value.host.length);
                    value.host = value.host.slice(0, value.host.search('/'))
                    value.likeImg = this.likeImg;
                    value.commentImg = this.commentImg;
                    value.viewImg = this.viewImg;
                })

            })
    }

    Users() {
        this._link.getUser()
            .subscribe(res => {
                this.users = res['data'].user;
            })

    }

    goTo() {
        this.navCtrl.setRoot('Tab1Page')
    }

    onInput(ev) {
    }

    getCategories() {
        if (this.openCategory) {
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });

            loading.present();
            this._link.getUserCategories()
                .subscribe(res => {
                    // console.log(res)
                    if (res) {
                        loading.dismiss();
                    }

                    this.data.categories = res['data'].categories;
                })
        }
    }

    openFriendRequest() {
        this.openFreind = !this.openFreind;
        this.openChat = false;
        this.openSearchBar = false;
        this.openNotificationBar = false;
        this.openCategory = false;
    }

    openSearch() {
        this.openSearchBar = !this.openSearchBar;
        this.openChat = false;
        this.openFreind = false;
        this.openNotificationBar = false;
        this.openCategory = false;
    }

    openChatMessege() {
        this.openChat = !this.openChat;
        this.openSearchBar = false;
        this.openFreind = false;
        this.openNotificationBar = false;
        this.openCategory = false;
    }

    openNotification() {
        this.openNotificationBar = !this.openNotificationBar;
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openCategory = false;
    }

    allWindowClick() {
        this.openSearchBar = false;
        this.openFreind = false;
        this.openChat = false;
        this.openNotificationBar = false;
        this.openCategory = false;
        this.openLinks = false;
    }

    presentActionSheet(ev, i) {
        console.log(ev)
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        this._link.deleteLinkFromList(this.links[i].id)
                            .subscribe(res => {
                                if (res['status'] === 'successMessage') {
                                    this.Links();
                                }
                            })
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel', // will always sort to be on the bottom
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();

    }

    linkCategory() {
        if (this.categoryValue === 'All Categories') {
            this.Links();
        } else if (this.categoryValue === 'Create category') {
            const prompt = this.alertCtrl.create({
                title: 'Add New Category',
                inputs: [
                    {
                        name: 'Category name',
                        placeholder: 'Category name'
                    },
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        handler: data => {
                            this.categoryValue = 'All Categories';
                        }
                    },
                    {
                        text: 'Save',
                        handler: data => {
                            this._link.createCategory(data['Category name'])
                                .subscribe(res => {
                                    this.categoryValue = 'All Categories';
                                    this.getCategories();
                                })
                            this.categoryValue = 'All Categories';
                        }
                    }
                ]
            });
            prompt.present();
            this.categoryValue = 'All Categories';
        }
        else {
            this.getLinkByCategoryName(this.categoryValue);
        }
    }

    getLinkByCategoryName(value) {
        console.log(value)
        this._link.getLinksByCategories(value)
            .subscribe(res => {
                console.log(res)
                this.links = res['data'].links;
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
                    value.host = value.url;
                    value.host = value.host.slice((value.host.search('/') + 2), value.host.length);
                    value.host = value.host.slice(0, value.host.search('/'));
                    value.likeImg = this.likeImg;
                    value.commentImg = this.commentImg;
                    value.viewImg = this.viewImg;
                })
            })
    }

    openCategories() {
        this.openCategory = !this.openCategory;
        this.getCategories();
    }

    allCategory() {
        this.categoryName = "All Categories";
        setTimeout(() => {
                this.Links();
                this.openCategory = false;
            }, 500
        )
    }

    someCategory(i) {
        this.categoryName = this.data.categories[i].name;
        this.categoryId = this.data.categories[i].id;
        this.categoryI = i;
        console.log(this.categoryName);
        this.getLinkByCategoryName(this.categoryId);
        setTimeout(() => {
            this.openCategory = false;
        }, 500);
    }

    createCategory() {
        const prompt = this.alertCtrl.create({
            title: 'Add New Category',
            inputs: [
                {
                    name: 'Category name',
                    placeholder: 'Category name'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        this.categoryValue = 'All Categories';
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this._link.createCategory(data['Category name'])
                            .subscribe(res => {
                                this.categoryValue = 'All Categories';
                                this.getCategories();
                            })
                        this.categoryValue = 'All Categories';
                    }
                }
            ]
        });
        prompt.present();
    }

    cancelCategory() {
        this.openCategory = false;
    }

    openWithBrowser(i) {
        let browser = this.iab.create(this.links[i].url,'_blank');
        browser.on('loadstart').subscribe(event => {
            console.log("loadstart -->",event);
        }, err => {
            console.log("InAppBrowser loadstart Event Error: " + err);
        })

        ;
    }

    createLink() {
        this.openLinks = true;
        const prompt = this.alertCtrl.create({
            title: 'Add New Link',
            inputs: [
                {
                    name: 'Link url',
                    placeholder: 'Link Url'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        this.openLinks = false;
                        //    this.categoryValue = 'All Categories';
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        console.log(this.categoryName);
                        if (this.categoryName === '' || this.categoryName === 'All Categories') {
                            this._link.createLinks(data['Link url'])
                                .subscribe(res => {
                                    console.log(res);
                                    this.openLinks = false;
                                      this.Links();
                                })
                            this.openLinks = false;
                        } else {
                            this._link.createLinksWithCategory(this.categoryId, data['Link url'])
                                .subscribe(res => {
                                    console.log(res);
                                    this.getLinkByCategoryName(this.categoryId);
                                    //   this.someCategory(this.categoryI);
                                    this.openLinks = false;
                                })
                        }


                    }
                }
            ]
        });
        prompt.present();
    }

    add() {

    }
}

