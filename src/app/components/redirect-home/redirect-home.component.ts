import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'cpn-redirect-home',
  templateUrl: './redirect-home.component.html'
})
export class RedirectHomeComponent {
  @Input() text: string = '';
}
