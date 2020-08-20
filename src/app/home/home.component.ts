import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  products = [];
  constructor(private apiService: ApiService) { }
  // tslint:disable-next-line:typedef
  ngOnInit(){
    this.apiService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      this.products = res.body;
    });
    }

    public firstPage() {
      this.products = [];
      this.apiService.sendGetRequestToUrl(this.apiService.first).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
        console.log(res);
        this.products = res.body;
      });
    }
    public previousPage() {

      if (this.apiService.prev !== undefined && this.apiService.prev !== '') {
        this.products = [];
        this.apiService.sendGetRequestToUrl(this.apiService.prev).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
          console.log(res);
          this.products = res.body;
        });
      }

    }
    public nextPage() {
      if (this.apiService.next !== undefined && this.apiService.next !== '') {
        this.products = [];
        this.apiService.sendGetRequestToUrl(this.apiService.next).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
          console.log(res);
          this.products = res.body;
        });
      }
    }
    public lastPage() {
      this.products = [];
      this.apiService.sendGetRequestToUrl(this.apiService.last).pipe(takeUntil(this.destroy$)).subscribe((res: HttpResponse<any>) => {
        console.log(res);
        this.products = res.body;
      });
    }

    ngOnDestroy() {
      this.destroy$.next(true);
      // Now let's also unsubscribe from the subject itself:
      this.destroy$.unsubscribe();
    }
}
