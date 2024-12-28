import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  template: `
    <div class="summary-card">
      <h3>{{ title }}</h3>
      <p>{{ value }}</p>
    </div>
  `,

})
export class SummaryCardComponent {
  @Input() title!: string;
  @Input() value!: number | string;
}
