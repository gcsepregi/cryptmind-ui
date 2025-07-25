import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRitualEntryComponent } from './view-ritual-entry.component';

describe('ViewRitualEntryComponent', () => {
  let component: ViewRitualEntryComponent;
  let fixture: ComponentFixture<ViewRitualEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRitualEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRitualEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
