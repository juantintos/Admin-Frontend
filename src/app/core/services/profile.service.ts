import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/pagination.model';
import { Profile, ProfileForm } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly API = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient) {}

  getAll(filters: PaginationParams = {}): Observable<ApiResponse<PaginatedResponse<Profile>>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<PaginatedResponse<Profile>>>(this.API, { params });
  }

  getById(id: string): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(`${this.API}/${id}`);
  }

  create(data: ProfileForm): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(this.API, data);
  }

  update(id: string, data: Partial<ProfileForm>): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(`${this.API}/${id}`, data);
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