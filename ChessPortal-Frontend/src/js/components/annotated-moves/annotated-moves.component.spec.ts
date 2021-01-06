import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatedMovesComponent } from './annotated-moves.component';

describe('AnnotatedMovesComponent', () => {
  let component: AnnotatedMovesComponent;
  let fixture: ComponentFixture<AnnotatedMovesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotatedMovesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotatedMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
