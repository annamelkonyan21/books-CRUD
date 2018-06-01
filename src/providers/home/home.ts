import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider} from "../api";
import 'rxjs/Rx';

@Injectable()
export class HomeProvider {

  public token:string;
  constructor(public http: HttpClient, public _api: ApiProvider) {
    console.log('Hello HomeProvider Provider');
    console.log(this._api);

  }

  public login(email, password) {
      return this.http.post(`${this._api.apiUrl}signin`, {email: email, password: password})
          .map((res) => {
                  if (res) {
                      this.token = res['data']['token'];
                      localStorage.setItem('token', JSON.stringify(this.token));
                      return true;
                  } else {
                      return false;
                  }
              }
          );
  }



  public signup(name, last_name, username, email, password, password_confirmation, birthday, gender) {
    return this.http.post(this._api.apiUrl+`signup`,{name: name, last_name: last_name, username: username, email: email, password: password, password_confirmation: password_confirmation, birthday: birthday, gender: gender})
        .map((res) => {
            if (res) {
                this.token = res['data']['token'];
                localStorage.setItem('token', JSON.stringify(this.token));
                return true;
            } else {
                return false;
            }
        });
  }
}
