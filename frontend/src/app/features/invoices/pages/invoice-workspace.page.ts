import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  ApiError,
  Invoice,
  InvoiceSummary,
  Recalculation,
  RecalculationRequest,
  UserType
} from '../../../core/models/invoice.models';
import { InvoiceService } from '../../../core/services/invoice.service';
import { InvoiceDetailComponent } from '../components/invoice-detail.component';
import { InvoiceListComponent } from '../components/invoice-list.component';
import { RecalculationPreviewComponent } from '../components/recalculation-preview.component';

@Component({
  selector: 'app-invoice-workspace',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    InvoiceDetailComponent,
    InvoiceListComponent,
    RecalculationPreviewComponent
  ],
  templateUrl: './invoice-workspace.page.html',
  styleUrl: './invoice-workspace.page.css'
})
export class InvoiceWorkspacePage implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly invoices = signal<InvoiceSummary[]>([]);
  protected readonly invoice = signal<Invoice | null>(null);
  protected readonly preview = signal<Recalculation | null>(null);
  protected readonly loading = signal(true);
  protected readonly calculating = signal(false);
  protected readonly saving = signal(false);
  protected readonly message = signal('');
  protected readonly messageType = signal<'error' | 'success'>('error');

  protected readonly form = this.formBuilder.nonNullable.group({
    userType: ['TYPE_A' as UserType, Validators.required],
    newSubtotal: [0, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit(): void {
    this.loadInvoices();
  }

  protected allowedIncrease(): number {
    return this.form.controls.userType.value === 'TYPE_A' ? 20_000 : 50_000;
  }

  protected maximumSubtotal(): number {
    return (this.invoice()?.subtotal ?? 0) + this.allowedIncrease();
  }

  protected selectInvoice(id: number): void {
    this.loading.set(true);
    this.preview.set(null);
    this.clearMessage();
    this.invoiceService
      .findById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (invoice) => {
          this.invoice.set(invoice);
          this.form.controls.newSubtotal.setValue(invoice.subtotal);
        },
        error: (error) => this.handleError(error)
      });
  }

  protected resetPreview(): void {
    this.preview.set(null);
    this.clearMessage();
  }

  protected calculate(): void {
    const invoice = this.invoice();
    if (!invoice || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.controls.newSubtotal.value > this.maximumSubtotal()) {
      this.showMessage('El subtotal supera el máximo autorizado para este tipo de usuario.', 'error');
      return;
    }

    this.calculating.set(true);
    this.preview.set(null);
    this.clearMessage();
    this.invoiceService
      .preview(this.buildRequest(invoice.id))
      .pipe(finalize(() => this.calculating.set(false)))
      .subscribe({
        next: (preview) => this.preview.set(preview),
        error: (error) => this.handleError(error)
      });
  }

  protected apply(): void {
    const invoice = this.invoice();
    if (!invoice || !this.preview()) return;

    this.saving.set(true);
    this.clearMessage();
    this.invoiceService
      .apply(this.buildRequest(invoice.id))
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updated) => {
          this.invoice.set(updated);
          this.preview.set(null);
          this.form.controls.newSubtotal.setValue(updated.subtotal);
          this.invoices.update((items) =>
            items.map((item) => (item.id === updated.id ? this.toSummary(updated) : item))
          );
          this.showMessage('Recálculo aplicado correctamente.', 'success');
        },
        error: (error) => this.handleError(error)
      });
  }

  private loadInvoices(): void {
    this.invoiceService.findAll().subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
        if (invoices.length > 0) {
          this.selectInvoice(invoices[0].id);
        } else {
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.handleError(error);
      }
    });
  }

  private buildRequest(invoiceId: number): RecalculationRequest {
    return {
      invoiceId,
      newSubtotal: this.form.controls.newSubtotal.value,
      userType: this.form.controls.userType.value
    };
  }

  private toSummary(invoice: Invoice): InvoiceSummary {
    return {
      id: invoice.id,
      subtotal: invoice.subtotal,
      totalIva: invoice.totalIva,
      total: invoice.total
    };
  }

  private handleError(response: HttpErrorResponse): void {
    const apiError = response.error as ApiError | undefined;
    const validation = apiError?.errors?.map((error) => error.message).join('. ');
    this.showMessage(
      validation || apiError?.message || 'No fue posible comunicarse con el servidor.',
      'error'
    );
  }

  private showMessage(message: string, type: 'error' | 'success'): void {
    this.message.set(message);
    this.messageType.set(type);
  }

  private clearMessage(): void {
    this.message.set('');
  }
}
