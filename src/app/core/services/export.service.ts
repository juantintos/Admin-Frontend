import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportService {
  downloadBlob(blob: Blob, filename: string): void {
    saveAs(blob, filename);
  }

  buildFilename(prefix: string, ext: 'pdf' | 'xlsx'): string {
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `${prefix}_${ts}.${ext}`;
  }
}