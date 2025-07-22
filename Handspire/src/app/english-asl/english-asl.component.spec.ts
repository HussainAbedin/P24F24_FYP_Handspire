import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishAslComponent } from './english-asl.component';

describe('EnglishAslComponent', () => {
  let component: EnglishAslComponent;
  let fixture: ComponentFixture<EnglishAslComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnglishAslComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnglishAslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
