import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AslService {
  // Change the URLs to use https://localhost:7168 for both APIs
  private englishApiUrl = 'https://localhost:7208/api/EnglishASL';
  private urduApiUrl = 'https://localhost:7208/api/UrduASL';

  constructor(private http: HttpClient) {}

  getAslImagesEnglish(letter: string): Observable<any> {
    return this.http.get<any>(`${this.englishApiUrl}/${letter}`).pipe(
      catchError(error => {
        console.error('Error fetching English ASL image', error);
        return of({}); // Return a default value in case of error
      })
    );
  }

  getAslImagesUrdu(letter: string): Observable<any> {
    return this.http.get<any>(`${this.urduApiUrl}/${letter}`).pipe(
      catchError(error => {
        console.error('Error fetching Urdu ASL image', error);
        return of({}); // Return a default value in case of error
      })
    );
  }
}
