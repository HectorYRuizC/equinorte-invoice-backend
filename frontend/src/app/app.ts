import { Component } from '@angular/core';

import { InvoiceWorkspacePage } from './features/invoices/pages/invoice-workspace.page';

@Component({
  selector: 'app-root',
  imports: [InvoiceWorkspacePage],
  template: '<app-invoice-workspace />'
})
export class App {}
