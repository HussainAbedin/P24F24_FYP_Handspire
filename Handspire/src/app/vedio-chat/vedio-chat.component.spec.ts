import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VedioChatComponent } from './vedio-chat.component';

describe('VedioChatComponent', () => {
  let component: VedioChatComponent;
  let fixture: ComponentFixture<VedioChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VedioChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VedioChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
