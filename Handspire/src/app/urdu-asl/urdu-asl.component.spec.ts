import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrduAslComponent } from './urdu-asl.component';

describe('UrduAslComponent', () => {
  let component: UrduAslComponent;
  let fixture: ComponentFixture<UrduAslComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrduAslComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrduAslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
