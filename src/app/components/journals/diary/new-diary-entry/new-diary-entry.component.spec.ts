import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDiaryEntryComponent } from './new-diary-entry.component';

describe('NewDiaryEntryComponent', () => {
  let component: NewDiaryEntryComponent;
  let fixture: ComponentFixture<NewDiaryEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDiaryEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDiaryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
