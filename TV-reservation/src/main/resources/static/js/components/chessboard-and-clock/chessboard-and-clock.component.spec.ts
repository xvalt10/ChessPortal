import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessboardAndClockComponent } from './chessboard-and-clock.component';

describe('ChessboardAndClockComponent', () => {
  let component: ChessboardAndClockComponent;
  let fixture: ComponentFixture<ChessboardAndClockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessboardAndClockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessboardAndClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
