import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDreamEntryComponent } from './view-dream-entry.component';

describe('ViewDreamEntryComponent', () => {
  let component: ViewDreamEntryComponent;
  let fixture: ComponentFixture<ViewDreamEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDreamEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDreamEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
