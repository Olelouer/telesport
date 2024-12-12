import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'cpn-block-number',
  templateUrl: './block-number.component.html',
})
export class BlockNumberComponent {
  @Input() title: string = '';
  @Input() number: number | null = null;
}