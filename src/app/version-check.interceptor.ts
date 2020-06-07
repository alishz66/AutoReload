import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable, EMPTY, throwError } from 'rxjs';
import { mergeMap, first, switchMap, catchError } from 'rxjs/operators';
import { VersionCheckService } from './version-check.service';
import { environment } from 'src/environments/environment';
import { EmbeddedTemplateAst } from '@angular/compiler';
import { MessageService } from './message.service';

@Injectable()
export class VersionCheckInterceptor implements HttpInterceptor {
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
  constructor(
    private versionCheckService: VersionCheckService,
    private messageService: MessageService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('version.json')) return next.handle(request);
    console.log('interceptor begin.');
    return this.versionCheckService
      .checkVersion(environment.versionCheckURL)
      .pipe(
        switchMap((response) => {
          console.log(response.hash);
          console.log(this.currentHash);
          const hash = response.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);
          console.log(hashChanged);
          // If new version, do something
          if (hashChanged) {
            console.log('version changed');
            // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
            // for an example: location.reload();
            // location.reload();
            this.messageService.addMessages(['نسخه نرم افزار بروز شده است.']);
            return EMPTY;
          }
          // store the new hash so we wouldn't trigger versionChange again
          // only necessary in case you did not force refresh
          this.currentHash = hash;
          return next.handle(request);
        })
      );
  }

  private hasHashChanged(currentHash, newHash) {
    // if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
    //   return false;
    // }

    return currentHash !== newHash;
  }
}
