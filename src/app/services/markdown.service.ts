import { Injectable } from '@angular/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import TurndownService from 'turndown';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private turndownService = new TurndownService();

  constructor() {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  render(content: string): string {
    // Convert markdown to HTML
    const html = marked.parse(content);

    // Sanitize HTML output
    return DOMPurify.sanitize(html as string, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 'del',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
        'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  }

  // Convert HTML back to Markdown (for editing)
  htmlToMarkdown(html: string): string {
    return this.turndownService.turndown(html);
  }
}
