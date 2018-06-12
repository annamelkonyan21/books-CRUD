import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiProvider} from "../api";

@Injectable()
export class UsersProvider {

  constructor(public http: HttpClient,
              public _api: ApiProvider) {
  }

  public getUsers() {
      return this.http.get(this._api.apiUrl+`users?page=1`)
  }

}
