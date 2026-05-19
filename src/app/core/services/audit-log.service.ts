import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/pagination.model';
import { AuditLog, AuditLogFilters } from '../models/audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly API = `${environment.apiUrl}/audit-logs`;

  constructor(private http: HttpClient) {}

  getAll(filters: AuditLogFilters = {}): Observable<ApiResponse<PaginatedResponse<AuditLog>>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<PaginatedResponse<AuditLog>>>(this.API, { params });
  }

  getHistory(model: string, modelId: string): Observable<ApiResponse<AuditLog[]>> {
    return this.http.get<ApiResponse<AuditLog[]>>(`${this.API}/${model}/${modelId}`);
  }

  getStats(): Observable<ApiResponse<Record<string, Record<string, number>>>> {
    return this.http.get<ApiResponse<Record<string, Record<string, number>>>>(`${this.API}/stats`);
  }
}