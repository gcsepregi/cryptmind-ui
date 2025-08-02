import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  faBold, faCode,
  faCompress,
  faExpand,
  faEye,
  faEyeSlash,
  faH,
  faItalic,
  faListDots, faListNumeric, faQuoteLeft, faStrikethrough
} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {MarkdownService} from '../../../services/markdown.service';

@Component({
  selector: 'app-markdown-editor',
  imports: [
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss'
})
export class MarkdownEditorComponent {
  @Input() content: string = '';
  @Input() showHeader: boolean = false;
  @Input() showPreview: boolean = false;
  @Input() rows: number = 10;
  @Input() fullscreen: boolean = false;

  @Output() contentChange = new EventEmitter<string>();
  @Output() titleChange = new EventEmitter<string>();

  get renderedContent(): string {
    return this.markdownService.render(this.content);
  }

  constructor(private readonly markdownService: MarkdownService) { }

  insertMarkdown(before: string, after: string) {
    const textarea = document.querySelector('.markdown-textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.content.substring(start, end);

    const newContent = this.content.substring(0, start) +
      before + selectedText + after +
      this.content.substring(end);

    this.content = newContent;
    this.onContentChange();

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    });
  }

  protected readonly faCompress = faCompress;
  protected readonly faExpand = faExpand;
  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEye = faEye;

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  protected onContentChange() {
    this.contentChange.emit(this.content);
  }

  protected readonly faBold = faBold;
  protected readonly faItalic = faItalic;
  protected readonly faH = faH;
  protected readonly faListDots = faListDots;
  protected readonly faQuoteLeft = faQuoteLeft;
  protected readonly faCode = faCode;
  protected readonly faListNumeric = faListNumeric;
  protected readonly faStrikethrough = faStrikethrough;
}
