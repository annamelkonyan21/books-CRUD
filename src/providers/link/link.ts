import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider} from "../api";

@Injectable()
export class LinkProvider {

  constructor(public http: HttpClient,
              public _api: ApiProvider) {

  }

  public getLink(page) {
    return this.http.get(this._api.apiUrl+`links?page=${page}`)
  }


  public getUser() {
      return this.http.get(this._api.apiUrl+`user`)
  }

  public getLinksByCategories(id) {
        return this.http.get(this._api.apiUrl+`links/+${id}`)
  }

  public getUserCategories() {
      return this.http.get(this._api.apiUrl+`categories`)
  }

  public deleteLinkFromList(id, category_id) {
      return this.http.delete(this._api.apiUrl+`links/+${id}+'/'+${category_id}` , )
  }

  public createCategory(category) {
      return this.http.post(this._api.apiUrl+`categories`, {category: category})

  }

  public createLinksWithCategory(category_id,url) {
      return this.http.post(this._api.apiUrl+`links`, {url: url, category_id:category_id})
  }

  public createLinks(url) {
        return this.http.post(this._api.apiUrl+`links`, {url: url})
  }

}
