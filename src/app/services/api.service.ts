import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  likedObjects: any[] = [];
  Base_url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
  base_url =
    'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/';
  private http = inject(HttpClient);
  constructor() {
    let likesFromStorage = localStorage.getItem('likes');
    if (likesFromStorage) {
      // checks if likesFromStorage is null, undefined, 0, false, NaN
      this.likedObjects = JSON.parse(localStorage.getItem('likes') || '');
    }
  }

  /**
   * fetch all painting object
   * @returns {Observable} as api response
   */
  getAllPaintingObjects(
    search?: string,
    includeImages?: boolean,
    departmentId?: number
  ): Observable<any> {
    let url = `${this.Base_url}search?q=${search ? search : 'painting'}`;
    if (includeImages) {
      url += '&hasImages=true';
    }
    if (departmentId) {
      url += `&departmentId=${departmentId}`;
    }
    return this.http.get<any>(url);
  }

  /**
   * fetch departments
   * @returns {Observable} as api response
   */
  getDepartments(search?: string): Observable<any> {
    return this.http.get<any>(`${this.Base_url}/departments`);
  }

  /**
   * fetch object details with object id
   * @param {number} id object id
   * @returns {Observable} as api response
   */
  getPaintingObject(id: number): Observable<any> {
    return this.http.get<any>(`${this.Base_url}objects/${id}`);
  }

  /**
   * fetch object comments by object id
   * @param {number} id object id
   * @returns {Observable} as api response
   */
  getCommentByObject(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.base_url}comments?item_id=${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * fetch object comments by object id
   * @param {number} id object id
   * @returns {Observable} as api response
   */
  getLikes(): Observable<any> {
    return this.http
      .get<any>(`${this.base_url}likes`)
      .pipe(catchError(this.handleError));
  }

  /**
   * add like by object id
   * @param {number} id object id
   * @returns {Observable} as api response
   */
  addCommentByObject(object: any): Observable<any> {
    return this.http
      .post<any>(`${this.base_url}comments`, object)
      .pipe(catchError(this.handleError));
  }

  /**
   * add like by object id
   * @param {number} id object id
   * @returns {Observable} as api response
   */
  addLikeByObject(object: any): Observable<any> {
    return this.http
      .post<any>(`${this.base_url}likes`, object)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
      //   `Backend returned code ${error.status}, body was: `,
      //   error.error
      // );
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('No data found!'));
  }
}
