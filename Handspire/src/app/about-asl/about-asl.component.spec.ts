import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAslComponent } from './about-asl.component';

describe('AboutAslComponent', () => {
  let component: AboutAslComponent;
  let fixture: ComponentFixture<AboutAslComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutAslComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutAslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
