import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule} from '@angular/forms';
import {RouterLink, ActivatedRoute, Router} from '@angular/router';
import {JournalsService} from '../../../../services/journals.service';
import {ToastrService} from 'ngx-toastr';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faMoon,
  faXmark,
  faCalendarAlt,
  faSignature,
  faStar,
  faUsers,
  faSmile,
  faEye,
  faPlus,
  faMapMarkerAlt,
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
import {ListEditorComponent} from '../../../../common-components/components/list-editor/list-editor.component';

@Component({
  selector: 'app-new-dream-entry',
  imports: [
    RouterLink,
    FaIconComponent,
    ReactiveFormsModule,
    MarkdownEditorComponent,
    FormsModule,
    CommonModule,
    ListEditorComponent
  ],
  templateUrl: './new-dream-entry.component.html',
  styleUrl: './new-dream-entry.component.scss'
})
export class NewDreamEntryComponent {
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faMoon = faMoon;
  protected readonly faXmark = faXmark;
  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faSignature = faSignature;
  protected readonly faStar = faStar;
  protected readonly faUsers = faUsers;
  protected readonly faSmile = faSmile;
  protected readonly faEye = faEye;
  protected readonly faPlus = faPlus;
  protected readonly faMapMarkerAlt = faMapMarkerAlt;
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
  dreamSignInput: string = '';
  dreamCharacterInput: string = '';
  dreamEmotionInput: string = '';

  constructor(private fb: FormBuilder,
              private readonly journalService: JournalsService,
              private readonly toastr: ToastrService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      entry: ['', Validators.required],
      tagInput: [''],
      dream_date: [''],
      mood: [''],
      location: [''],
      lucidity_level: [3], // Default to middle value
      dream_clarity: [3], // Default to middle value
      dream_signs: this.fb.array([]),
      dream_characters: this.fb.array([]),
      dream_emotions: this.fb.array([])
    });

    // Subscribe to mood changes in the form
    this.form.get('mood')?.valueChanges.subscribe(value => {
      this.selectedMood = value;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.entryId = id;
        this.journalService.getJournalEntry(id, 'dream').subscribe(entry => {
          this.form.patchValue({
            title: entry.title,
            entry: entry.entry,
            dream_date: entry.dream_date || '',
            mood: entry.mood || '',
            location: entry.location || '',
            lucidity_level: entry.lucidity_level || 3,
            dream_clarity: entry.dream_clarity || 3
          });
          this.tags = entry.tags ? entry.tags.map((t: any) => t.name || t) : [];

          // Load dream signs
          if (entry.dream_signs && entry.dream_signs.length > 0) {
            const dreamSignsArray = this.form.get('dream_signs') as FormArray;
            dreamSignsArray.clear();
            entry.dream_signs.forEach(item => {
              dreamSignsArray.push(this.fb.control(item));
            });
          }

          // Load dream characters
          if (entry.dream_characters && entry.dream_characters.length > 0) {
            const dreamCharactersArray = this.form.get('dream_characters') as FormArray;
            dreamCharactersArray.clear();
            entry.dream_characters.forEach(item => {
              dreamCharactersArray.push(this.fb.control(item));
            });
          }

          // Load dream emotions
          if (entry.dream_emotions && entry.dream_emotions.length > 0) {
            const dreamEmotionsArray = this.form.get('dream_emotions') as FormArray;
            dreamEmotionsArray.clear();
            entry.dream_emotions.forEach(item => {
              dreamEmotionsArray.push(this.fb.control(item));
            });
          }
        });
      }
    });
  }

  // Getters for form arrays
  get dreamSigns() {
    return this.form.get('dream_signs') as FormArray;
  }

  get dreamCharacters() {
    return this.form.get('dream_characters') as FormArray;
  }

  get dreamEmotions() {
    return this.form.get('dream_emotions') as FormArray;
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

  // Methods for dream signs
  addDreamSign() {
    if (this.dreamSignInput.trim()) {
      this.dreamSigns.push(this.fb.control(this.dreamSignInput.trim()));
      this.dreamSignInput = '';
    }
  }

  removeDreamSign(index: number) {
    this.dreamSigns.removeAt(index);
  }

  // Methods for dream characters
  addDreamCharacter() {
    if (this.dreamCharacterInput.trim()) {
      this.dreamCharacters.push(this.fb.control(this.dreamCharacterInput.trim()));
      this.dreamCharacterInput = '';
    }
  }

  removeDreamCharacter(index: number) {
    this.dreamCharacters.removeAt(index);
  }

  // Methods for dream emotions
  addDreamEmotion() {
    if (this.dreamEmotionInput.trim()) {
      this.dreamEmotions.push(this.fb.control(this.dreamEmotionInput.trim()));
      this.dreamEmotionInput = '';
    }
  }

  removeDreamEmotion(index: number) {
    this.dreamEmotions.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      const {title, entry, dream_date, mood, location, lucidity_level, dream_clarity} = this.form.value;
      const tags = this.tags;

      // Convert form arrays to simple string arrays
      const dream_signs = this.dreamSigns.value;
      const dream_characters = this.dreamCharacters.value;
      const dream_emotions = this.dreamEmotions.value;

      const journalData: NewJournal = {
        journal_type: 'dream',
        entry,
        title,
        tags,
        mood,
        location,
        dream_date,
        lucidity_level,
        dream_clarity,
        dream_signs,
        dream_characters,
        dream_emotions
      };

      if (this.entryId) {
        this.journalService.updateJournalEntry(this.entryId, 'dream', journalData).subscribe({
          next: () => {
            this.toastr.success('Dream entry updated');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Failed to update dream entry. Please try again.');
          }
        });
      } else {
        this.journalService.createJournalEntry(journalData).subscribe({
          next: () => {
            this.toastr.success('Dream entry created');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Dream entry failed to create. Please try again.');
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
  onDreamSignAdded(item: string) {
    this.dreamSignInput = '';
  }

  onDreamSignRemoved(index: number) {
    // No additional action needed, the FormArray is already updated by the list editor
  }

  onDreamCharacterAdded(item: string) {
    this.dreamCharacterInput = '';
  }

  onDreamCharacterRemoved(index: number) {
    // No additional action needed, the FormArray is already updated by the list editor
  }

  onDreamEmotionAdded(item: string) {
    this.dreamEmotionInput = '';
  }

  onDreamEmotionRemoved(index: number) {
    // No additional action needed, the FormArray is already updated by the list editor
  }

}
