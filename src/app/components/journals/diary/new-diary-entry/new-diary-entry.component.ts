import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormArray} from '@angular/forms';
import {RouterLink, ActivatedRoute, Router} from '@angular/router';
import {JournalsService} from '../../../../services/journals.service';
import {ToastrService} from 'ngx-toastr';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faBook,
  faXmark,
  faMapMarkerAlt,
  faSmile,
  faCalendarAlt,
  faListUl,
  faTrophy,
  faPlus,
  faFrown,
  faAngry,
  faMeh,
  faLaugh,
  faSadTear,
  faGrinHearts
} from '@fortawesome/free-solid-svg-icons';
import {MarkdownEditorComponent} from '../../../tools/markdown-editor/markdown-editor.component';
import {CommonModule} from '@angular/common';
import {NewJournal} from '../../../../models/journal.model';
import {ListEditorComponent} from '../../../shared/list-editor/list-editor.component';

@Component({
  selector: 'app-new-diary-entry',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterLink,
    MarkdownEditorComponent,
    FormsModule,
    CommonModule,
    ListEditorComponent
  ],
  templateUrl: './new-diary-entry.component.html',
  styleUrl: './new-diary-entry.component.scss'
})
export class NewDiaryEntryComponent {
  protected readonly faXmark = faXmark;
  protected readonly faBook = faBook;
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faMapMarkerAlt = faMapMarkerAlt;
  protected readonly faSmile = faSmile;
  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faListUl = faListUl;
  protected readonly faTrophy = faTrophy;
  protected readonly faFrown = faFrown;
  protected readonly faAngry = faAngry;
  protected readonly faMeh = faMeh;
  protected readonly faLaugh = faLaugh;
  protected readonly faSadTear = faSadTear;
  protected readonly faGrinHearts = faGrinHearts;

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
  gratitudeInput: string = '';
  achievementInput: string = '';

  constructor(private fb: FormBuilder,
              private readonly journalService: JournalsService,
              private readonly toastr: ToastrService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      entry: ['', Validators.required],
      tagInput: [''],
      diary_date: [''],
      mood: [''],
      location: [''],
      gratitude_list: this.fb.array([]),
      achievements: this.fb.array([])
    });

    // Subscribe to mood changes in the form
    this.form.get('mood')?.valueChanges.subscribe(value => {
      this.selectedMood = value;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.entryId = id;
        this.journalService.getJournalEntry(id, 'diary').subscribe(entry => {
          this.form.patchValue({
            title: entry.title,
            entry: entry.entry,
            diary_date: entry.diary_date || '',
            mood: entry.mood || '',
            location: entry.location || ''
          });
          this.tags = entry.tags ? entry.tags.map((t: any) => t.name || t) : [];

          // Load gratitude list
          if (entry.gratitude_list && entry.gratitude_list.length > 0) {
            const gratitudeArray = this.form.get('gratitude_list') as FormArray;
            gratitudeArray.clear();
            entry.gratitude_list.forEach(item => {
              gratitudeArray.push(this.fb.control(item));
            });
          }

          // Load achievements
          if (entry.achievements && entry.achievements.length > 0) {
            const achievementsArray = this.form.get('achievements') as FormArray;
            achievementsArray.clear();
            entry.achievements.forEach(item => {
              achievementsArray.push(this.fb.control(item));
            });
          }
        });
      }
    });
  }

  // Getters for form arrays
  get gratitudeList() {
    return this.form.get('gratitude_list') as FormArray;
  }

  get achievements() {
    return this.form.get('achievements') as FormArray;
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

  addGratitudeItem() {
    if (this.gratitudeInput.trim()) {
      this.gratitudeList.push(this.fb.control(this.gratitudeInput.trim()));
      this.gratitudeInput = '';
    }
  }

  removeGratitudeItem(index: number) {
    this.gratitudeList.removeAt(index);
  }

  addAchievementItem() {
    if (this.achievementInput.trim()) {
      this.achievements.push(this.fb.control(this.achievementInput.trim()));
      this.achievementInput = '';
    }
  }

  removeAchievementItem(index: number) {
    this.achievements.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      const {title, entry, diary_date, mood, location} = this.form.value;
      const tags = this.tags;

      // Convert form arrays to simple string arrays
      const gratitude_list = this.gratitudeList.value;
      const achievements = this.achievements.value;

      const journalData: NewJournal = {
        journal_type: 'diary',
        entry,
        title,
        tags,
        diary_date,
        mood,
        location,
        gratitude_list,
        achievements
      };

      if (this.entryId) {
        this.journalService.updateJournalEntry(this.entryId, 'diary', journalData).subscribe({
          next: () => {
            this.toastr.success('Diary entry updated');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Failed to update diary entry. Please try again.');
          }
        });
      } else {
        this.journalService.createJournalEntry(journalData).subscribe({
          next: () => {
            this.toastr.success('Diary entry created');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Diary entry failed to create. Please try again.');
          }
        });
      }
      console.log(journalData);
    }
  }

  entryContentChanged(content: string) {
    this.form.patchValue({entry: content});
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

  // Methods for handling list editor events
  onGratitudeItemAdded(item: string) {
    this.gratitudeInput = '';
  }

  onGratitudeItemRemoved(index: number) {
    // No additional action needed, the FormArray is already updated by the list editor
  }

  onAchievementItemAdded(item: string) {
    this.achievementInput = '';
  }

  onAchievementItemRemoved(index: number) {
    // No additional action needed, the FormArray is already updated by the list editor
  }

  protected readonly faPlus = faPlus;
}
