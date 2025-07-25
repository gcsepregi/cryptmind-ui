import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRitualEntryComponent } from './new-ritual-entry.component';

describe('NewRitualEntryComponent', () => {
  let component: NewRitualEntryComponent;
  let fixture: ComponentFixture<NewRitualEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRitualEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRitualEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
