import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValentineSelection } from './valentine-selection';

describe('ValentineSelection', () => {
  let component: ValentineSelection;
  let fixture: ComponentFixture<ValentineSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValentineSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValentineSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
