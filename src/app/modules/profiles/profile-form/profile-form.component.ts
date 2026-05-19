import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile, AVAILABLE_PERMISSIONS } from '../../../core/models/profile.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
})
export class ProfileFormComponent implements OnChanges {
  @Input()  visible = false;
  @Input()  profile: Profile | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved         = new EventEmitter<void>();

  form:        FormGroup;
  loading      = false;
  permissions  = AVAILABLE_PERMISSIONS;
  selected:    string[] = [];

  constructor(
    private fb:             FormBuilder,
    private profileService: ProfileService,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnChanges(): void {
    if (this.profile) {
      this.form.patchValue({ name: this.profile.name });
      this.selected = [...(this.profile.permissions ?? [])];
    } else {
      this.form.reset();
      this.selected = [];
    }
  }

  get f() { return this.form.controls; }
  get isEdit(): boolean { return !!this.profile; }

  togglePermission(value: string): void {
    const idx = this.selected.indexOf(value);
    idx === -1 ? this.selected.push(value) : this.selected.splice(idx, 1);
  }

  isSelected(value: string): boolean {
    return this.selected.includes(value);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.selected.length === 0) {
      this.messageService.add({
        severity: 'warn', summary: 'Permisos requeridos',
        detail: 'Selecciona al menos un permiso.',
      });
      return;
    }

    this.loading = true;
    const payload = { name: this.form.value.name, permissions: this.selected };

    const action$ = this.isEdit
      ? this.profileService.update(this.profile!.id, payload)
      : this.profileService.create(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success', summary: 'Éxito',
          detail: this.isEdit ? 'Perfil actualizado.' : 'Perfil creado.',
        });
        this.loading = false;
        this.close();
        this.saved.emit();
      },
      error: () => { this.loading = false; },
    });
  }

  close(): void {
    this.visibleChange.emit(false);
    this.form.reset();
    this.selected = [];
  }
}