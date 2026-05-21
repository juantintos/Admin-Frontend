import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeValue',
  standalone: false,
})
export class SafeValuePipe implements PipeTransform {

  transform(value: any): string {

    if (value === null || value === undefined) {
      return '—';
    }

    // Booleanos
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }

    // Strings
    if (typeof value === 'string') {
      return value || '—';
    }

    // Números
    if (typeof value === 'number') {
      return String(value);
    }

    // Arrays
    if (Array.isArray(value)) {
      return value.join(', ') || '—';
    }

    // Fechas MongoDB BSON
    if (value?.$date?.$numberLong) {
      const date = new Date(Number(value.$date.$numberLong));

      return date.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }

    // ObjectId Mongo
    if (value?.$oid) {
      return value.$oid;
    }

    // Objetos normales
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }
}