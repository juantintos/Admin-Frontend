import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProfileService } from '../../../core/services/profile.service';
import { ExportService } from '../../../core/services/export.service';
import { Profile } from '../../../core/models/profile.model';

@Component({
  standalone: false,
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent implements OnInit {
  profiles:    Profile[] = [];
  loading      = false;
  totalRecords = 0;
  rows         = 15;
  currentPage  = 1;
  search       = '';
  showForm     = false;
  showDetail   = false;
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
      next: res => { this.profiles = res.data.items; this.totalRecords = res.data.total; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onPageChange(e: any): void { this.currentPage = Math.floor(e.first / e.rows) + 1; this.rows = e.rows; this.load(); }
  openCreate(): void { this.editProfile = null; this.showForm = true; }
  openEdit(p: Profile): void { this.editProfile = { ...p }; this.showForm = true; }
  openDetail(p: Profile): void { this.detailProfile = p; this.showDetail = true; }
  onFormSaved(): void { this.showForm = false; this.load(); }

  confirmDelete(profile: Profile): void {
    this.confirmService.confirm({
      message: `¿Eliminar <strong>${profile.name}</strong>?`,
      header: 'Confirmar', icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar', rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.profileService.delete(profile.id).subscribe({
        next: () => { this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Perfil eliminado.' }); this.load(); },
        error: err => { this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo eliminar.' }); },
      }),
    });
  }

  permissionLabel(p: string): string {
    return ({ products: 'Productos', users: 'Usuarios', profiles: 'Perfiles' } as any)[p] ?? p;
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
}