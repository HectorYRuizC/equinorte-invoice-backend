import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Invoice } from '../../../core/models/invoice.models';

@Component({
  selector: 'app-invoice-detail',
  imports: [CurrencyPipe],
  template: `
    <section class="detail">
      <div class="heading">
        <div>
          <span>Factura #{{ invoice.id }}</span>
          <h2>Detalle de factura</h2>
        </div>
        <span class="state"><i></i> Registrada</span>
      </div>

      <div class="totals">
        <article>
          <small>Subtotal</small>
          <strong>{{ invoice.subtotal | currency: 'COP' : '$' : '1.0-0' }}</strong>
        </article>
        <article>
          <small>IVA</small>
          <strong>{{ invoice.totalIva | currency: 'COP' : '$' : '1.0-0' }}</strong>
        </article>
        <article class="total">
          <small>Total</small>
          <strong>{{ invoice.total | currency: 'COP' : '$' : '1.0-0' }}</strong>
        </article>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Valor</th>
              <th>IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            @for (detail of invoice.details; track detail.productName) {
              <tr>
                <td data-label="Producto">{{ detail.productName }}</td>
                <td data-label="Valor">{{ detail.price | currency: 'COP' : '$' : '1.0-0' }}</td>
                <td data-label="IVA">{{ detail.iva | currency: 'COP' : '$' : '1.0-0' }}</td>
                <td data-label="Total">{{ detail.total | currency: 'COP' : '$' : '1.0-0' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
  styleUrl: './invoice-detail.component.css'
})
export class InvoiceDetailComponent {
  @Input({ required: true }) invoice!: Invoice;
}
