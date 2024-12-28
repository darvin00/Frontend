import { Component, HostListener } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Thikse-E-commerce';
  constructor(private location: Location) { }
 @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const targetElement = event.target as HTMLElement;

    if (event.key === 'Backspace'
      && targetElement.tagName !== 'INPUT'
      && targetElement.tagName !== 'TEXTAREA'
      && !targetElement.isContentEditable
      && !this.isSpecialField(targetElement)) {
    this.location.back();
  }
}

isSpecialField(element: HTMLElement): boolean {
  // Check if the element is your special field or include additional conditions here
  return element.id === 'special-field-id' || element.classList.contains('special-class');

  }









}
