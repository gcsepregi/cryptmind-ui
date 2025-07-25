import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiaryEntryComponent } from './view-diary-entry.component';

describe('ViewDiaryEntryComponent', () => {
  let component: ViewDiaryEntryComponent;
  let fixture: ComponentFixture<ViewDiaryEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDiaryEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDiaryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
