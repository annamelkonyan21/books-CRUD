import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiProvider} from "../api";

@Injectable()
export class LinkProvider {

    constructor(public http: HttpClient,
                public _api: ApiProvider) {

    }

    public getLink(page) {
        return this.http.get(this._api.apiUrl + `links?page=${page}`)
    }

    public getLinksByCategories(id) {
        return this.http.get(this._api.apiUrl + `links/+${id}`)
    }

    public getUserCategories() {
        return this.http.get(this._api.apiUrl + `categories`)
    }

    public deleteLinkFromList(id, category_id) {
        return this.http.delete(this._api.apiUrl + `links/${id}/${category_id}`,)
    }

    public createCategory(category) {
        return this.http.post(this._api.apiUrl + `categories`, {category: category})

    }

    public createLinksWithCategory(category_id, url) {
        return this.http.post(this._api.apiUrl + `links`, {url: url, category_id: category_id})
    }

    public createLinks(url) {
        return this.http.post(this._api.apiUrl + `links`, {url: url})
    }

    public getLinksByDiscussion(category_id, discussion_id) {
        return this.http.get(this._api.apiUrl + `links/${category_id}/${discussion_id}`)
    }

    public createLinkByDiscussion(category_id, discussion_id, url) {
        return this.http.post(this._api.apiUrl + `links/to-discussion`, {
            category_id: category_id,
            discussion_id: discussion_id,
            url: url
        })
    }

    public deleteLinkFromDiscussionList(link_id, discussion_id, category_id) {
        return this.http.delete(this._api.apiUrl + `links/${link_id}/discussion/${discussion_id}/${category_id}`)
    }

    public deleteCategory(category_id) {
        return this.http.delete(this._api.apiUrl+`categories/${category_id}`)
    }

}
