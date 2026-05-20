import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Profile } from '../../../core/models/profile.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnChanges {
  @Input()  visible  = false;
  @Input()  user:     User | null    = null;
  @Input()  profiles: Profile[]      = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved         = new EventEmitter<void>();

  form:          FormGroup;
  loading        = false;
  avatarPreview: string | null = null;
  avatarFile:    File | null   = null;

  phoneCodes = [
    { label: '+52 México',    value: '+52' },
    { label: '+1 USA/Canadá', value: '+1'  },
    { label: '+34 España',    value: '+34' },
    { label: '+57 Colombia',  value: '+57' },
    { label: '+54 Argentina', value: '+54' },
  ];

  constructor(
    private fb:             FormBuilder,
    private userService:    UserService,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      name:       ['', [Validators.required, Validators.maxLength(150)]],
      email:      ['', [Validators.required, Validators.email]],
      password:   ['', [Validators.required, Validators.minLength(8)]],
      phone_code: ['+52'],
      phone:      [''],
      profile_id: ['', Validators.required],
      is_active:  [true],
    });
  }

  ngOnChanges(): void {
    if (this.user) {
      this.form.patchValue({
        name: this.user.name, email: this.user.email,
        phone_code: this.user.phone_code ?? '+52',
        phone: this.user.phone, profile_id: this.user.profile?.id,
        is_active: this.user.is_active,
      });
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.avatarPreview = this.user.avatar ?? null;
    } else {
      this.form.reset({ phone_code: '+52', is_active: true });
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.form.get('password')?.updateValueAndValidity();
      this.avatarPreview = null;
      this.avatarFile    = null;
    }
  }

  get f() { return this.form.controls; }
  get isEdit(): boolean { return !!this.user; }

  get profileOptions() {
    return this.profiles.map(p => ({ label: p.name, value: p.id }));
  }

  onAvatarSelected(event: any): void {
    const file: File = event.target?.files?.[0];
    if (!file) return;
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = e => { this.avatarPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.isEdit && !this.avatarFile) {
      this.messageService.add({ severity: 'warn', summary: 'Avatar requerido', detail: 'Selecciona una foto.' });
      return;
    }
    this.loading = true;
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') formData.append(k, String(v));
    });
    if (this.avatarFile) formData.append('avatar', this.avatarFile);

    const action$ = this.isEdit
      ? this.userService.update(this.user!.id, formData)
      : this.userService.create(formData);

    action$.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: this.isEdit ? 'Usuario actualizado.' : 'Usuario creado.' });
        this.loading = false; this.close(); this.saved.emit();
      },
      error: () => { this.loading = false; },
    });
  }

  close(): void {
    this.visibleChange.emit(false);
    this.form.reset({ phone_code: '+52', is_active: true });
    this.avatarPreview = null; this.avatarFile = null;
  }
}