import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiProvider} from "../api";

@Injectable()
export class NotificationsProvider {

    constructor(public http: HttpClient,
                public _api: ApiProvider) {

    }

    public getNotifications(page) {
        return this.http.get(this._api.apiUrl + `users/notifications?page=${page}`)
    }

    public readAllNotifications() {
        return this.http.get(this._api.apiUrl + `users/notifications/readAll`)
    }

    public readNotificationByID(notification_id) {
        return this.http.get(this._api.apiUrl + `users/notification/read/${notification_id}`)
    }

    public getNotificationsByPage(page) {
        return this.http.get(this._api.apiUrl + `users/notifications?page=${page}`)
    }

    public getNotificationsWithoutPage() {
        return this.http.get(this._api.apiUrl + `users/notifications?page`)
    }

}
