import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationScreenComponent } from './invitation-screen.component';

describe('InvitationScreenComponent', () => {
  let component: InvitationScreenComponent;
  let fixture: ComponentFixture<InvitationScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
