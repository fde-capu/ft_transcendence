import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FttAuthenticatorComponent } from './ftt-authenticator.component';

describe('FttAuthenticatorComponent', () => {
  let component: FttAuthenticatorComponent;
  let fixture: ComponentFixture<FttAuthenticatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FttAuthenticatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FttAuthenticatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
