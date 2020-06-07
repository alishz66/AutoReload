import { Component } from '@angular/core';
import { VersionCheckService } from './version-check.service';
import { environment } from 'src/environments/environment';
import { NewsApiService, Article } from './news-api.service';
import { Subject } from 'rxjs';
import { MessageService } from './message.service';
import { takeUntil } from 'rxjs/operators';
import { error } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'AutoReload';
  private ngUnsubscribe = new Subject();
  UsArticles: Article[];
  message: string;
  UsTotalRecordNumber: number;
  modalOpen = false;
  a = 'ali';
  b = 'ali';
  //change in app
  // b1 = 'alsdfsfsi';
  // c = 'ali';
  constructor(
    private versionCheckService: VersionCheckService,
    private newsApiService: NewsApiService,
    private messageService: MessageService
  ) {
    newsApiService.pagesOutput.subscribe((articles) => {
      this.UsArticles = articles;
    });
    newsApiService.totalRecordNumber.subscribe((totalPages) => {
      this.UsTotalRecordNumber = totalPages;
    });
    this.initializeMessages();
  }
  private initializeMessages() {
    this.messageService
      .getMessages()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((messages) => {
        //this.displayErrorRef.error = errors
        console.log(messages);
        this.message = messages[0];
        this.modalOpen = true;
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  onGetNewsClick() {
    this.newsApiService.getPage(1, 10);
  }
  ngOnInit() {
    // this.versionCheckService.initVersionCheck(
    //   environment.versionCheckURL,
    //   5000
    // );
  }
  refreshApp() {
    location.reload();
  }
  modalShow() {
    this.modalOpen = !this.modalOpen;
  }
}
