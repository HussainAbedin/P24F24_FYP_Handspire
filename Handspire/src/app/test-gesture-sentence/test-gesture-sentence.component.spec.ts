import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGestureSentenceComponent } from './test-gesture-sentence.component';

describe('TestGestureSentenceComponent', () => {
  let component: TestGestureSentenceComponent;
  let fixture: ComponentFixture<TestGestureSentenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestGestureSentenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestGestureSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
