import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Recalculation } from '../../../core/models/invoice.models';

@Component({
  selector: 'app-recalculation-preview',
  imports: [CurrencyPipe],
  template: `
    <section class="preview">
      <div class="preview-heading">
        <div>
          <span>Vista previa</span>
          <h2>Nueva distribución</h2>
        </div>
        <button type="button" class="close" aria-label="Cerrar vista previa" (click)="closed.emit()">×</button>
      </div>

      <div class="change">
        <div>
          <small>Subtotal anterior</small>
          <strong>{{ preview.oldSubtotal | currency: 'COP' : '$' : '1.0-0' }}</strong>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <small>Nuevo subtotal</small>
          <strong>{{ preview.newSubtotal | currency: 'COP' : '$' : '1.0-0' }}</strong>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Nuevo valor</th>
              <th>IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            @for (detail of preview.details; track detail.productName) {
              <tr>
                <td>{{ detail.productName }}</td>
                <td>{{ detail.price | currency: 'COP' : '$' : '1.0-0' }}</td>
                <td>{{ detail.iva | currency: 'COP' : '$' : '1.0-0' }}</td>
                <td>{{ detail.total | currency: 'COP' : '$' : '1.0-0' }}</td>
              </tr>
            }
          </tbody>
          <tfoot>
            <tr>
              <td>Total recalculado</td>
              <td></td>
              <td>{{ preview.iva | currency: 'COP' : '$' : '1.0-0' }}</td>
              <td>{{ preview.total | currency: 'COP' : '$' : '1.0-0' }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="actions">
        <button type="button" class="secondary" (click)="closed.emit()">Cancelar</button>
        <button type="button" class="primary" [disabled]="saving" (click)="confirmed.emit()">
          {{ saving ? 'Guardando...' : 'Aplicar recálculo' }}
        </button>
      </div>
    </section>
  `,
  styleUrl: './recalculation-preview.component.css'
})
export class RecalculationPreviewComponent {
  @Input({ required: true }) preview!: Recalculation;
  @Input() saving = false;
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly confirmed = new EventEmitter<void>();
}
