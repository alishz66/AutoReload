import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap, map, switchMap, pluck } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';

interface NewApiResponse {
  totalResults: number;
  articles: Article[];
}

export interface Article {
  url: String;
  title: String;
  source: {
    name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize: number;
  private apiKey = 'a896adf6646342bd81e6c3a83fd4a93f';
  private country = 'us';

  private pagesInput: Subject<number>;
  pagesOutput: Observable<Article[]>;
  totalRecordNumber: Subject<number>;

  constructor(private http: HttpClient) {
    this.totalRecordNumber = new Subject();

    this.pagesInput = new Subject();
    this.pagesOutput = this.pagesInput.pipe(
      map((pageNumber) => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', this.pageSize.toString())
          .set('page', pageNumber.toString());
      }),
      switchMap((params) => {
        return http.get<NewApiResponse>(this.url, { params });
      }),
      tap((response) => {
        this.totalRecordNumber.next(response.totalResults);
      }),
      pluck('articles')
    );
  }
  getPage(pageNumber: number, pageSize: number) {
    this.pageSize = pageSize;
    this.pagesInput.next(pageNumber);
  }
}
