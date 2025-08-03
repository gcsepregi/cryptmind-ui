import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJournalEntriesComponent } from './user-journal-entries.component';

describe('UserJournalEntriesComponent', () => {
  let component: UserJournalEntriesComponent;
  let fixture: ComponentFixture<UserJournalEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJournalEntriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserJournalEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
