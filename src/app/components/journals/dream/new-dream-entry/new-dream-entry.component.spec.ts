import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDreamEntryComponent } from './new-dream-entry.component';

describe('NewDreamEntryComponent', () => {
  let component: NewDreamEntryComponent;
  let fixture: ComponentFixture<NewDreamEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDreamEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDreamEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
