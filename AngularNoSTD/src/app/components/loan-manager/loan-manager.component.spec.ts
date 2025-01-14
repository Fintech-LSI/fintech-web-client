import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanManagerComponent } from './loan-manager.component';

describe('LoanManagerComponent', () => {
  let component: LoanManagerComponent;
  let fixture: ComponentFixture<LoanManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
