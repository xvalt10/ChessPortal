import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingChartComponent } from './rating-chart.component';

describe('RatingChartComponent', () => {
  let component: RatingChartComponent;
  let fixture: ComponentFixture<RatingChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
