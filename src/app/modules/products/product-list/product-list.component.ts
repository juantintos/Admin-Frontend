import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../../../core/services/product.service';
import { ExportService } from '../../../core/services/export.service';
import { Product, ProductFilters } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products:    Product[] = [];
  loading      = false;
  totalRecords = 0;
  rows         = 15;
  currentPage  = 1;
  filters: ProductFilters = { search: '', per_page: 15 };
  showForm     = false;
  editProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private exportService:  ExportService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.productService.getAll({ ...this.filters, page: this.currentPage }).subscribe({
      next: res => { this.products = res.data.items; this.totalRecords = res.data.total; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.rows = event.rows;
    this.filters.per_page = event.rows;
    this.load();
  }

  openCreate(): void { this.editProduct = null; this.showForm = true; }
  openEdit(p: Product): void { this.editProduct = { ...p }; this.showForm = true; }
  onFormSaved(): void { this.showForm = false; this.load(); }

  confirmDelete(product: Product): void {
    this.confirmService.confirm({
      message: `¿Eliminar <strong>${product.name}</strong>?`,
      header: 'Confirmar', icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar', rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.productService.delete(product.id).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado.' }); this.load(); },
      }),
    });
  }

  exportPdf(): void {
    this.productService.exportPdf().subscribe(blob =>
      this.exportService.downloadBlob(blob, this.exportService.buildFilename('productos', 'pdf'))
    );
  }

  exportExcel(): void {
    this.productService.exportExcel().subscribe(blob =>
      this.exportService.downloadBlob(blob, this.exportService.buildFilename('productos', 'xlsx'))
    );
  }
}