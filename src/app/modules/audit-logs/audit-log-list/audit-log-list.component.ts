import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { AuditLog, AuditLogFilters } from '../../../core/models/audit-log.model';

@Component({
  standalone: false,
  selector: 'app-audit-log-list',
  templateUrl: './audit-log-list.component.html',
  styleUrls: ['./audit-log-list.component.scss'],
})
export class AuditLogListComponent implements OnInit {
  logs:         AuditLog[] = [];
  loading       = false;
  totalRecords  = 0;
  rows          = 20;
  currentPage   = 1;
  filters: AuditLogFilters = {};
  selectedLog:  AuditLog | null = null;
  showDetail    = false;

  modelOptions  = [
    { label: 'Todos',     value: null      },
    { label: 'Productos', value: 'Product' },
    { label: 'Usuarios',  value: 'User'    },
    { label: 'Perfiles',  value: 'Profile' },
  ];

  actionOptions = [
    { label: 'Todas',         value: null      },
    { label: 'Creación',      value: 'created' },
    { label: 'Actualización', value: 'updated' },
    { label: 'Eliminación',   value: 'deleted' },
  ];

  constructor(private auditService: AuditLogService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.auditService.getAll({ ...this.filters, per_page: this.rows, page: this.currentPage }).subscribe({
      next: res => { this.logs = res.data.items; this.totalRecords = res.data.total; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onPageChange(e: any): void { this.currentPage = Math.floor(e.first / e.rows) + 1; this.rows = e.rows; this.load(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.load(); }
  openDetail(log: AuditLog): void { this.selectedLog = log; this.showDetail = true; }
  actionSeverity(action: string): string { return ({ created: 'success', updated: 'warning', deleted: 'danger' } as any)[action] ?? 'info'; }
  hasChanges(log: AuditLog): boolean { return !!log.changes && Object.keys(log.changes).length > 0; }
  changeKeys(log: AuditLog): string[] { return Object.keys(log.changes ?? {}); }
  getNewValueEntries(log: AuditLog): { key: string; value: any }[] {
    if (!log?.new_values) {
      return [];
    }
    return Object.entries(log.new_values)
      .map(([key, value]) => ({ key, value }));
  }
  fieldLabels: Record<string, string> = {
  name: 'Nombre',
  brand: 'Marca',
  price: 'Precio',
  code: 'Código',
  email: 'Correo',
  phone: 'Teléfono',
  profile_id: 'Perfil',
  is_active: 'Activo',
  created_at: 'Fecha de creación',
  updated_at: 'Fecha de actualización',
  
  };
  formatFieldName(field: string): string {
  return this.fieldLabels[field] || field;
}
}