import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ExportService } from '../../../core/services/export.service';
import { User, UserFilters } from '../../../core/models/user.model';
import { Profile } from '../../../core/models/profile.model';

@Component({
  standalone: false,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users:        User[]    = [];
  profiles:     Profile[] = [];
  loading       = false;
  totalRecords  = 0;
  rows          = 15;
  currentPage   = 1;
  filters: UserFilters    = { search: '', per_page: 15 };
  showForm      = false;
  showDetail    = false;
  editUser:     User | null = null;
  detailUser:   User | null = null;

  statusOptions = [
    { label: 'Todos',     value: null  },
    { label: 'Activos',   value: true  },
    { label: 'Inactivos', value: false },
  ];

  constructor(
    private userService:    UserService,
    private profileService: ProfileService,
    private exportService:  ExportService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void { this.load(); this.loadProfiles(); }

  load(): void {
    this.loading = true;
    this.userService.getAll({ ...this.filters, page: this.currentPage }).subscribe({
      next: res => { this.users = res.data.items; this.totalRecords = res.data.total; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  private loadProfiles(): void {
    this.profileService.getAll({ per_page: 100 }).subscribe({
      next: res => { this.profiles = res.data.items; },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.rows = event.rows;
    this.filters.per_page = event.rows;
    this.load();
  }

  openCreate(): void { this.editUser = null; this.showForm = true; }
  openEdit(u: User): void { this.editUser = { ...u }; this.showForm = true; }
  openDetail(u: User): void { this.detailUser = u; this.showDetail = true; }
  onFormSaved(): void { this.showForm = false; this.load(); }

  confirmDelete(user: User): void {
    this.confirmService.confirm({
      message: `¿Eliminar a <strong>${user.name}</strong>?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.userService.delete(user.id).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Usuario eliminado.' }); this.load(); },
      }),
    });
  }

  profileOptions() {
    return [
      { label: 'Todos los perfiles', value: null },
      ...this.profiles.map(p => ({ label: p.name, value: p.id })),
    ];
  }

  exportPdf(): void {
    this.userService.exportPdf().subscribe(blob =>
      this.exportService.downloadBlob(blob, this.exportService.buildFilename('usuarios', 'pdf'))
    );
  }

  exportExcel(): void {
    this.userService.exportExcel().subscribe(blob =>
      this.exportService.downloadBlob(blob, this.exportService.buildFilename('usuarios', 'xlsx'))
    );
  }
}