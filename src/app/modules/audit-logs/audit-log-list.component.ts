import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../../core/services/audit-log.service';
import { AuditLog, AuditLogFilters } from '../../core/models/audit-log.model';

@Component({
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

  modelOptions = [
    { label: 'Todos',     value: null       },
    { label: 'Productos', value: 'Product'  },
    { label: 'Usuarios',  value: 'User'     },
    { label: 'Perfiles',  value: 'Profile'  },
  ];

  actionOptions = [
    { label: 'Todas',         value: null       },
    { label: 'Creación',      value: 'created'  },
    { label: 'Actualización', value: 'updated'  },
    { label: 'Eliminación',   value: 'deleted'  },
  ];

  constructor(private auditService: AuditLogService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.auditService.getAll({ ...this.filters, per_page: this.rows, page: this.currentPage }).subscribe({
      next: res => {
        this.logs        = res.data.items;
        this.totalRecords = res.data.total;
        this.loading     = false;
      },
      error: () => { this.loading = false; },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.rows        = event.rows;
    this.load();
  }

  clearFilters(): void {
    this.filters     = {};
    this.currentPage = 1;
    this.load();
  }

  openDetail(log: AuditLog): void {
    this.selectedLog = log;
    this.showDetail  = true;
  }

  actionSeverity(action: string): string {
    return { created: 'success', updated: 'warning', deleted: 'danger' }[action] ?? 'info';
  }

  hasChanges(log: AuditLog): boolean {
    return log.changes && Object.keys(log.changes).length > 0;
  }

  changeKeys(log: AuditLog): string[] {
    return Object.keys(log.changes ?? {});
  }
}