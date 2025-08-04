import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule} from '@angular/forms';
import {RouterLink, ActivatedRoute, Router} from '@angular/router';
import {JournalsService} from '../../../../services/journals.service';
import {ToastrService} from 'ngx-toastr';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faStar,
  faXmark,
  faCalendarAlt,
  faTools,
  faPray,
  faPenFancy,
  faCheckCircle,
  faClock,
  faSmile,
  faMapMarkerAlt,
  faFrown,
  faAngry,
  faMeh,
  faLaugh,
  faSadTear,
  faGrinHearts,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import {MarkdownEditorComponent} from '../../../tools/markdown-editor/markdown-editor.component';
import {CommonModule} from '@angular/common';
import {NewJournal} from '../../../../models/journal.model';

@Component({
  selector: 'app-new-ritual-entry',
  imports: [
    RouterLink,
    FaIconComponent,
    ReactiveFormsModule,
    MarkdownEditorComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './new-ritual-entry.component.html',
  styleUrl: './new-ritual-entry.component.scss'
})
export class NewRitualEntryComponent {
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faStar = faStar;
  protected readonly faXmark = faXmark;
  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faTools = faTools;
  protected readonly faPray = faPray;
  protected readonly faPenFancy = faPenFancy;
  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faClock = faClock;
  protected readonly faSmile = faSmile;
  protected readonly faMapMarkerAlt = faMapMarkerAlt;
  protected readonly faFrown = faFrown;
  protected readonly faAngry = faAngry;
  protected readonly faMeh = faMeh;
  protected readonly faLaugh = faLaugh;
  protected readonly faSadTear = faSadTear;
  protected readonly faGrinHearts = faGrinHearts;
  protected readonly faPlus = faPlus;

  // Define mood options
  moodOptions = [
    { icon: this.faGrinHearts, value: 'love', label: 'Love' },
    { icon: this.faLaugh, value: 'happy', label: 'Happy' },
    { icon: this.faSmile, value: 'good', label: 'Good' },
    { icon: this.faMeh, value: 'neutral', label: 'Neutral' },
    { icon: this.faFrown, value: 'sad', label: 'Sad' },
    { icon: this.faSadTear, value: 'very-sad', label: 'Very Sad' },
    { icon: this.faAngry, value: 'angry', label: 'Angry' }
  ];

  selectedMood: string = '';

  form: FormGroup;
  tags: string[] = [];
  entryId?: string;
  ritualToolInput: string = '';
  ritualDeityInput: string = '';

  constructor(private fb: FormBuilder,
              private readonly journalService: JournalsService,
              private readonly toastr: ToastrService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      entry: ['', Validators.required],
      tagInput: [''],
      ritual_date: [''],
      mood: [''],
      location: [''],
      ritual_type: [''],
      ritual_tools: this.fb.array([]),
      ritual_deities: this.fb.array([]),
      ritual_purpose: [''],
      ritual_outcome: [''],
      ritual_duration: [0]
    });

    // Subscribe to mood changes in the form
    this.form.get('mood')?.valueChanges.subscribe(value => {
      this.selectedMood = value;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.entryId = id;
        this.journalService.getJournalEntry(id, 'ritual').subscribe(entry => {
          this.form.patchValue({
            title: entry.title,
            entry: entry.entry,
            ritual_date: entry.ritual_date || '',
            mood: entry.mood || '',
            location: entry.location || '',
            ritual_type: entry.ritual_type || '',
            ritual_purpose: entry.ritual_purpose || '',
            ritual_outcome: entry.ritual_outcome || '',
            ritual_duration: entry.ritual_duration || 0
          });
          this.tags = entry.tags ? entry.tags.map((t: any) => t.name || t) : [];

          // Load ritual tools
          if (entry.ritual_tools && entry.ritual_tools.length > 0) {
            const ritualToolsArray = this.form.get('ritual_tools') as FormArray;
            ritualToolsArray.clear();
            entry.ritual_tools.forEach(item => {
              ritualToolsArray.push(this.fb.control(item));
            });
          }

          // Load ritual deities
          if (entry.ritual_deities && entry.ritual_deities.length > 0) {
            const ritualDeitiesArray = this.form.get('ritual_deities') as FormArray;
            ritualDeitiesArray.clear();
            entry.ritual_deities.forEach(item => {
              ritualDeitiesArray.push(this.fb.control(item));
            });
          }
        });
      }
    });
  }

  // Getters for form arrays
  get ritualTools() {
    return this.form.get('ritual_tools') as FormArray;
  }

  get ritualDeities() {
    return this.form.get('ritual_deities') as FormArray;
  }

  addTag(event: KeyboardEvent) {
    const input = this.form.get('tagInput');
    const value = input?.value?.trim();
    if ((event.key === 'Enter' || event.key === ',') && value) {
      event.preventDefault();
      if (!this.tags.includes(value)) {
        this.tags.push(value);
      }
      input?.setValue('');
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  // Methods for ritual tools
  addRitualTool() {
    if (this.ritualToolInput.trim()) {
      this.ritualTools.push(this.fb.control(this.ritualToolInput.trim()));
      this.ritualToolInput = '';
    }
  }

  removeRitualTool(index: number) {
    this.ritualTools.removeAt(index);
  }

  // Methods for ritual deities
  addRitualDeity() {
    if (this.ritualDeityInput.trim()) {
      this.ritualDeities.push(this.fb.control(this.ritualDeityInput.trim()));
      this.ritualDeityInput = '';
    }
  }

  removeRitualDeity(index: number) {
    this.ritualDeities.removeAt(index);
  }

  // Method to handle mood selection
  selectMood(moodValue: string) {
    this.form.patchValue({mood: moodValue});
  }

  // Method to get the icon for the current mood
  getMoodIcon() {
    const selectedOption = this.moodOptions.find(option => option.value === this.selectedMood);
    return selectedOption ? selectedOption.icon : this.faSmile;
  }

  onSubmit() {
    if (this.form.valid) {
      const {title, entry, ritual_date, mood, location, ritual_type, ritual_purpose, ritual_outcome, ritual_duration} = this.form.value;
      const tags = this.tags;

      // Convert form arrays to simple string arrays
      const ritual_tools = this.ritualTools.value;
      const ritual_deities = this.ritualDeities.value;

      const journalData: NewJournal = {
        journal_type: 'ritual',
        entry,
        title,
        tags,
        mood,
        location,
        ritual_date,
        ritual_type,
        ritual_tools,
        ritual_deities,
        ritual_purpose,
        ritual_outcome,
        ritual_duration
      };

      if (this.entryId) {
        this.journalService.updateJournalEntry(this.entryId, 'ritual', journalData).subscribe({
          next: () => {
            this.toastr.success('Ritual entry updated');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Failed to update ritual entry. Please try again.');
          }
        });
      } else {
        this.journalService.createJournalEntry(journalData).subscribe({
          next: () => {
            this.toastr.success('Ritual entry created');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Ritual entry failed to create. Please try again.');
          }
        });
      }
      console.log(journalData);
    }
  }

  entryContentChanged(content: string) {
    this.form.patchValue({entry: content});
  }

}
