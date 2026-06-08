import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Invoice,
  InvoiceSummary,
  Recalculation,
  RecalculationRequest
} from '../models/invoice.models';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/invoices';

  findAll(): Observable<InvoiceSummary[]> {
    return this.http.get<InvoiceSummary[]>(this.baseUrl);
  }

  findById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  preview(request: RecalculationRequest): Observable<Recalculation> {
    return this.http.post<Recalculation>(`${this.baseUrl}/recalculate`, request);
  }

  apply(request: RecalculationRequest): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/recalculate/apply`, request);
  }
}
