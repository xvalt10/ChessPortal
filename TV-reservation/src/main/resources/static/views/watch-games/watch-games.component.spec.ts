import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchGamesComponent } from './watch-games.component';

describe('WatchGamesComponent', () => {
  let component: WatchGamesComponent;
  let fixture: ComponentFixture<WatchGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
