import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule }           from 'primeng/table';
import { ButtonModule }          from 'primeng/button';
import { InputTextModule }       from 'primeng/inputtext';
import { DialogModule }          from 'primeng/dialog';
import { ConfirmDialogModule }   from 'primeng/confirmdialog';
import { ToastModule }           from 'primeng/toast';
import { TagModule }             from 'primeng/tag';
import { BadgeModule }           from 'primeng/badge';
import { AvatarModule }          from 'primeng/avatar';
import { ChipModule }            from 'primeng/chip';
import { DropdownModule }        from 'primeng/dropdown';
import { CheckboxModule }        from 'primeng/checkbox';
import { PaginatorModule }       from 'primeng/paginator';
import { SkeletonModule }        from 'primeng/skeleton';
import { ToolbarModule }         from 'primeng/toolbar';
import { CardModule }            from 'primeng/card';
import { DividerModule }         from 'primeng/divider';
import { InputNumberModule }     from 'primeng/inputnumber';
import { TooltipModule }         from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SafeValuePipe }         from '../pipes/safe-value.pipe';

const PRIMENG_MODULES = [
  TableModule, ButtonModule, InputTextModule, DialogModule,
  ConfirmDialogModule, ToastModule, TagModule, BadgeModule,
  AvatarModule, ChipModule, DropdownModule, CheckboxModule,
  PaginatorModule, SkeletonModule, ToolbarModule, CardModule,
  DividerModule, InputNumberModule, TooltipModule,
  ProgressSpinnerModule,
];

@NgModule({
  declarations: [
    SafeValuePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...PRIMENG_MODULES,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SafeValuePipe,
    ...PRIMENG_MODULES,
  ],
})
export class SharedModule {}