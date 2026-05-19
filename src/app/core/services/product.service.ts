import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/pagination.model';
import { Product, ProductFilters, ProductForm } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(filters: ProductFilters = {}): Observable<ApiResponse<PaginatedResponse<Product>>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<PaginatedResponse<Product>>>(this.API, { params });
  }

  getById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.API}/${id}`);
  }

  create(data: ProductForm): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.API, data);
  }

  update(id: string, data: Partial<ProductForm>): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.API}/${id}`, data);
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