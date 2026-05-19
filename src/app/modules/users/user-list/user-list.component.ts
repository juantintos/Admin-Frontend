import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ExportService } from '../../../core/services/export.service';
import { ProfileService } from '../../../core/services/profile.service';
import { User, UserFilters } from '../../../core/models/user.model';
import { Profile } from '../../../core/models/profile.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users:        User[]    = [];
  profiles:     Profile[] = [];
  loading       = false;
  totalRecords  = 0;
  rows          = 15;
  currentPage   = 1;

  filters: UserFilters = { search: '', per_page: 15 };

  showForm   = false;
  showDetail = false;
  editUser:   User | null = null;
  detailUser: User | null = null;

  statusOptions = [
    { label: 'Todos',    value: null  },
    { label: 'Activos',  value: true  },
    { label: 'Inactivos',value: false },
  ];

  constructor(
    private userService:    UserService,
    private profileService: ProfileService,
    private exportService:  ExportService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadProfiles();
  }

  load(): void {
    this.loading = true;
    this.userService.getAll({ ...this.filters, page: this.currentPage }).subscribe({
      next: res => {
        this.users       = res.data.items;
        this.totalRecords = res.data.total;
        this.loading     = false;
      },
      error: () => { this.loading = false; },
    });
  }

  private loadProfiles(): void {
    this.profileService.getAll({ per_page: 100 }).subscribe({
      next: res => { this.profiles = res.data.items; },
    });
  }

  onPageChange(event: any): void {
    this.currentPage      = Math.floor(event.first / event.rows) + 1;
    this.rows             = event.rows;
    this.filters.per_page = event.rows;
    this.load();
  }

  openCreate(): void {
    this.editUser = null;
    this.showForm = true;
  }

  openEdit(user: User): void {
    this.editUser = { ...user };
    this.showForm = true;
  }

  openDetail(user: User): void {
    this.detailUser = user;
    this.showDetail = true;
  }

  onFormSaved(): void {
    this.showForm = false;
    this.load();
  }

  confirmDelete(user: User): void {
    this.confirmService.confirm({
      message:  `¿Eliminar al usuario <strong>${user.name}</strong>?`,
      header:   'Confirmar eliminación',
      icon:     'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(user.id),
    });
  }

  private delete(id: string): void {
    this.userService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success', summary: 'Eliminado',
          detail: 'Usuario eliminado correctamente.',
        });
        this.load();
      },
    });
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

  profileOptions() {
    return [
      { label: 'Todos los perfiles', value: null },
      ...this.profiles.map(p => ({ label: p.name, value: p.id })),
    ];
  }
}