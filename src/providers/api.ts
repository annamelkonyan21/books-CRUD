import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ApiProvider {

    public apiUrl: string;

    constructor(public http: HttpClient) {
        this.apiUrl = 'https://api.linker.am/v1/';
    }

}
