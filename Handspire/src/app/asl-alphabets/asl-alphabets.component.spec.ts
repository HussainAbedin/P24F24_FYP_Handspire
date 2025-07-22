import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AslAlphabetsComponent } from './asl-alphabets.component';

describe('AslAlphabetsComponent', () => {
  let component: AslAlphabetsComponent;
  let fixture: ComponentFixture<AslAlphabetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AslAlphabetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AslAlphabetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
