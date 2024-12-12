import { Component } from '@angular/core';
import { Input } from '@angular/core';

/**
 * A simple block component that displays a title and a number.
 * The block is only displayed if both `title` and `number` are provided, and `number` is greater than 0.
 *
 * @input title - The title text for the block.
 * @input number - The numerical value to display (must be greater than 0 to render).
 */

@Component({
  selector: 'cpn-block-number',
  templateUrl: './block-number.component.html',
})
export class BlockNumberComponent {
  @Input() title: string = '';
  @Input() number: number | null = null;
}