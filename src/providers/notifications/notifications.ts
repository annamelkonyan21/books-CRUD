import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from "../api";

@Injectable()
export class NotificationsProvider {

  constructor(public http: HttpClient,
              public _api: ApiProvider) {

  }

  public getNotifications() {
    return this.http.get(this._api.apiUrl+'users/notifications?page=1')
  }
}
