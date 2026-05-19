import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../core/shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ProductListComponent,
    ProductFormComponent],
})
export class ProductsModule {}