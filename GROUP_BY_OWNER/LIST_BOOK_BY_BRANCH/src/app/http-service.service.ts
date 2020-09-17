import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(
    private http: HttpClient
  ) { }

  getBookList() {
    return this.http.get('http://54.198.46.240/test/api.php');
  }
}
