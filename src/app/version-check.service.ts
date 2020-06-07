import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(private http: HttpClient) {}

  /**
   * Checks in every set frequency the version of frontend application
   * @param url
   * @param {number} frequency - in milliseconds, defaults to 30 minutes
   */
  public initVersionCheck(url, frequency = 1000 * 60 * 30) {
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
  }

  /**
   * Will do the call and check if the hash has changed or not
   * @param url
   */
  public checkVersion(url): Observable<any> {
    // timestamp these requests to invalidate caches
    let versionChanged = false;
    // console.log('service begin.');
    if (isDevMode()) {
      return of({
        version: 'debug',
        hash: 'debug',
      });
    }
    return this.http.get(url + '?t=' + new Date().getTime());
    // .subscribe(
    //   (response: any) => {
    //     console.log(response.hash);
    //     console.log(this.currentHash);
    //     const hash = response.hash;
    //     const hashChanged = this.hasHashChanged(this.currentHash, hash);

    //     // If new version, do something
    //     if (hashChanged) {
    //       // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
    //       // for an example: location.reload();
    //       versionChanged=  true;
    //     }
    //     // store the new hash so we wouldn't trigger versionChange again
    //     // only necessary in case you did not force refresh
    //     this.currentHash = hash;
    //     return false;
    //   },
    //   (err) => {
    //     console.error(err, 'Could not get version');
    //     return false;
    //   }
    // );
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash
   * @param newHash
   * @returns {boolean}
   */
  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return currentHash !== newHash;
  }
}
