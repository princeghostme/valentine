import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrposeMessage } from './prpose-message';

describe('PrposeMessage', () => {
  let component: PrposeMessage;
  let fixture: ComponentFixture<PrposeMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrposeMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrposeMessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
