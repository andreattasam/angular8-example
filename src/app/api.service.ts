import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private SERVER_URL = 'http://localhost:3000/products';
  public first = '';
  public prev = '';
  public next = '';
  public last = '';

  constructor(private httpClient: HttpClient) { }

  // tslint:disable-next-line:typedef
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  // tslint:disable-next-line:typedef
  parseLinkHeader(header) {
    if (header.length === 0) {
      return ;
    }

    const parts = header.split(',');
    // tslint:disable-next-line:one-variable-per-declaration
    const links: any = {};
    parts.forEach( p => {
    const section = p.split(';');
    const url = section[0].replace(/<(.*)>/, '$1').trim();
    const name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;

    });

    this.first  = links.first;
    this.last   = links.last;
    this.prev   = links.prev;
    this.next   = links.next;
  }

  // tslint:disable-next-line:typedef
  public sendGetRequest(){
    // Add safe, URL encoded _page and _limit parameters

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.SERVER_URL, {  params: new HttpParams({fromString: '_page=1&_limit=20'}), observe: 'response'}).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }

  public sendGetRequestToUrl(url: string){
    return this.httpClient.get(url, { observe: 'response'}).pipe(retry(3),
    catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }
}
