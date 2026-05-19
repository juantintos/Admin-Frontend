import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/pagination.model';
import { User, UserFilters } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(filters: UserFilters = {}): Observable<ApiResponse<PaginatedResponse<User>>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<PaginatedResponse<User>>>(this.API, { params });
  }

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API}/${id}`);
  }

  create(formData: FormData): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.API, formData);
  }

  update(id: string, formData: FormData): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.API}/${id}?_method=PUT`, formData);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API}/${id}`);
  }

  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.API}/export/pdf`, { responseType: 'blob' });
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.API}/export/excel`, { responseType: 'blob' });
  }
}