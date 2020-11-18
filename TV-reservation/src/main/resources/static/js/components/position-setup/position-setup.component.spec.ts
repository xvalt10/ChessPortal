import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionSetupComponent } from './position-setup.component';

describe('PositionSetupComponent', () => {
  let component: PositionSetupComponent;
  let fixture: ComponentFixture<PositionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
