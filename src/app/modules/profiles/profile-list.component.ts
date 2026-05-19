import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';
import { ExportService } from '../../core/services/export.service';
import { Profile } from '../../core/models/profile.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
})
export class ProfileListComponent implements OnInit {
  profiles:     Profile[] = [];
  loading       = false;
  totalRecords  = 0;
  rows          = 15;
  currentPage   = 1;
  search        = '';

  showForm    = false;
  showDetail  = false;
  editProfile:   Profile | null = null;
  detailProfile: Profile | null = null;

  constructor(
    private profileService: ProfileService,
    private exportService:  ExportService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.profileService.getAll({ search: this.search, per_page: this.rows, page: this.currentPage }).subscribe({
      next: res => {
        this.profiles    = res.data.items;
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

  openCreate(): void { this.editProfile = null; this.showForm = true; }

  openEdit(profile: Profile): void { this.editProfile = { ...profile }; this.showForm = true; }

  openDetail(profile: Profile): void { this.detailProfile = profile; this.showDetail = true; }

  onFormSaved(): void { this.showForm = false; this.load(); }

  confirmDelete(profile: Profile): void {
    this.confirmService.confirm({
      message: `¿Eliminar el perfil <strong>${profile.name}</strong>?`,
      header:  'Confirmar eliminación',
      icon:    'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(profile.id),
    });
  }

  private delete(id: string): void {
    this.profileService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success', summary: 'Eliminado',
          detail: 'Perfil eliminado correctamente.',
        });
        this.load();
      },
      error: err => {
        this.messageService.add({
          severity: 'error', summary: 'Error',
          detail: err.error?.message ?? 'No se pudo eliminar el perfil.',
        });
      },
    });
  }

  exportPdf(): void {
    this.profileService.exportPdf().subscribe(blob =>
      this.exportService.downloadBlob(blob, this.exportService.buildFilename('perfiles', 'pdf'))
    );
  }

  exportExcel(): void {
    this.profileService.exportExcel().subscribe(blob =>
      this.exportService.downloadBlob(blob, this.exportService.buildFilename('perfiles', 'xlsx'))
    );
  }

  permissionLabel(perm: string): string {
    return { products: 'Productos', users: 'Usuarios', profiles: 'Perfiles' }[perm] ?? perm;
  }
}