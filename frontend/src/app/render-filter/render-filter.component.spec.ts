import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderFilterComponent } from './render-filter.component';

describe('RenderFilterComponent', () => {
  let component: RenderFilterComponent;
  let fixture: ComponentFixture<RenderFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
