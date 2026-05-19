export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: 'created' | 'updated' | 'deleted';
  action_label: string;
  model: string;
  model_id: string;
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  changes: Record<string, { from: any; to: any }>;
  ip_address: string;
  logged_at: string;
}

export interface AuditLogFilters {
  model?: string;
  action?: string;
  user_id?: string;
  model_id?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}