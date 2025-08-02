import { Pipe, PipeTransform } from '@angular/core';
import { MarkdownService } from '../services/markdown.service';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  constructor(private markdownService: MarkdownService) {}

  transform(value: string): string {
    if (!value) {
      return '';
    }
    
    return this.markdownService.render(value);
  }
} 