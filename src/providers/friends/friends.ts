import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from "../api";

@Injectable()
export class FriendsProvider {

  constructor(public http: HttpClient,
              public _api: ApiProvider) { }

  public getFriendsRequests(user_id){
    return this.http.get(this._api.apiUrl+`users/friend-request/+${user_id}`)
  }
}
