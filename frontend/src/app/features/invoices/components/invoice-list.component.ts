import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { InvoiceSummary } from '../../../core/models/invoice.models';

@Component({
  selector: 'app-invoice-list',
  imports: [CurrencyPipe],
  template: `
    <aside class="invoice-list">
      <div class="list-header">
        <h2>Facturas</h2>
        <span>{{ invoices.length }}</span>
      </div>

      <div class="items">
        @for (invoice of invoices; track invoice.id) {
          <button
            type="button"
            class="invoice-item"
            [class.active]="invoice.id === selectedId"
            (click)="selected.emit(invoice.id)"
          >
            <span class="number">Factura #{{ invoice.id }}</span>
            <strong>{{ invoice.total | currency: 'COP' : '$' : '1.0-0' }}</strong>
            <small>Subtotal {{ invoice.subtotal | currency: 'COP' : '$' : '1.0-0' }}</small>
            <i aria-hidden="true">›</i>
          </button>
        } @empty {
          <p class="empty">No hay facturas registradas.</p>
        }
      </div>
    </aside>
  `,
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent {
  @Input({ required: true }) invoices: InvoiceSummary[] = [];
  @Input() selectedId: number | null = null;
  @Output() readonly selected = new EventEmitter<number>();
}
