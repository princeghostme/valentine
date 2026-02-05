import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectMessage } from './reject-message';

describe('RejectMessage', () => {
  let component: RejectMessage;
  let fixture: ComponentFixture<RejectMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectMessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
