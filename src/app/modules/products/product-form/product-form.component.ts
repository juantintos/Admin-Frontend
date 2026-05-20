import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnChanges {
  @Input()  visible  = false;
  @Input()  product: Product | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved         = new EventEmitter<void>();

  form:    FormGroup;
  loading  = false;

  constructor(
    private fb:             FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      name:  ['', [Validators.required, Validators.maxLength(150)]],
      brand: ['', [Validators.required, Validators.maxLength(100)]],
      price: [null, [Validators.required, Validators.min(0), Validators.max(999)]],
    });
  }

  ngOnChanges(): void {
    this.product ? this.form.patchValue(this.product) : this.form.reset();
  }

  get f() { return this.form.controls; }
  get isEdit(): boolean { return !!this.product; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const action$ = this.isEdit
      ? this.productService.update(this.product!.id, this.form.value)
      : this.productService.create(this.form.value);

    action$.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: this.isEdit ? 'Actualizado.' : 'Creado.' });
        this.loading = false; this.close(); this.saved.emit();
      },
      error: () => { this.loading = false; },
    });
  }

  close(): void { this.visibleChange.emit(false); this.form.reset(); }
}