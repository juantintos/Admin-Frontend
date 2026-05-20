import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="layout-wrapper">
      <app-sidebar></app-sidebar>
      <div class="layout-main">
        <app-header></app-header>
        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper { display: flex; min-height: 100vh; }
    .layout-main { flex: 1; display: flex; flex-direction: column; background: #f8f9fa; }
    .layout-content { flex: 1; padding: 1.5rem; overflow-y: auto; }
  `],
})
export class LayoutComponent {}