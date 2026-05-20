import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile, AVAILABLE_PERMISSIONS } from '../../../core/models/profile.model';

@Component({
  standalone: false,
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnChanges {
  @Input()  visible = false;
  @Input()  profile: Profile | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved         = new EventEmitter<void>();

  form:       FormGroup;
  loading     = false;
  permissions = AVAILABLE_PERMISSIONS;
  selected:   string[] = [];

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
    if (this.profile) { this.form.patchValue({ name: this.profile.name }); this.selected = [...(this.profile.permissions ?? [])]; }
    else { this.form.reset(); this.selected = []; }
  }

  get f() { return this.form.controls; }
  get isEdit(): boolean { return !!this.profile; }
  togglePermission(v: string): void { const i = this.selected.indexOf(v); i === -1 ? this.selected.push(v) : this.selected.splice(i, 1); }
  isSelected(v: string): boolean { return this.selected.includes(v); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.selected.length) { this.messageService.add({ severity: 'warn', summary: 'Requerido', detail: 'Selecciona un permiso.' }); return; }
    this.loading = true;
    const payload = { name: this.form.value.name, permissions: this.selected };
    const action$ = this.isEdit ? this.profileService.update(this.profile!.id, payload) : this.profileService.create(payload);
    action$.subscribe({
      next: () => { this.messageService.add({ severity: 'success', summary: 'Éxito', detail: this.isEdit ? 'Actualizado.' : 'Creado.' }); this.loading = false; this.close(); this.saved.emit(); },
      error: () => { this.loading = false; },
    });
  }

  close(): void { this.visibleChange.emit(false); this.form.reset(); this.selected = []; }
}