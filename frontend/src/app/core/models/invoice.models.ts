export type UserType = 'TYPE_A' | 'TYPE_B';

export interface InvoiceSummary {
  id: number;
  total: number;
  totalIva: number;
  subtotal: number;
}

export interface InvoiceDetail {
  productName: string;
  price: number;
  iva: number;
  total: number;
}

export interface Invoice extends InvoiceSummary {
  details: InvoiceDetail[];
}

export interface RecalculationRequest {
  invoiceId: number;
  newSubtotal: number;
  userType: UserType;
}

export interface Recalculation {
  oldSubtotal: number;
  newSubtotal: number;
  iva: number;
  total: number;
  details: InvoiceDetail[];
}

export interface ApiError {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}
