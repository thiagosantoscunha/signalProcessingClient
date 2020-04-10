import { DataResponse } from './models/data-response.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  serialProccess(file: any): Observable<DataResponse> {
    return this.http.post<DataResponse>('api/file', {image: file.changingThisBreaksApplicationSecurity});
  }

  getImageLightGray(): Observable<DataResponse> {
    return this.http.get<DataResponse>('api/file');
  }

}
