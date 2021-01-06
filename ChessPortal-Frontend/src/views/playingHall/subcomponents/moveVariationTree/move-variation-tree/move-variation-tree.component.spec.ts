import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveVariationTreeComponent } from './move-variation-tree.component';

describe('MoveVariationTreeComponent', () => {
  let component: MoveVariationTreeComponent;
  let fixture: ComponentFixture<MoveVariationTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveVariationTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveVariationTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
