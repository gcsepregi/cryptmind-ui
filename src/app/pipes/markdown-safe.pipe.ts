import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownService } from '../services/markdown.service';

@Pipe({
  name: 'markdownSafe',
  standalone: true
})
export class MarkdownSafePipe implements PipeTransform {
  constructor(
    private markdownService: MarkdownService,
    private sanitizer: DomSanitizer
  ) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }
    
    const html = this.markdownService.render(value);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
} 