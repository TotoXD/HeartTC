import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDeckComponent } from './choose-deck.component';

describe('ChooseDeckComponent', () => {
  let component: ChooseDeckComponent;
  let fixture: ComponentFixture<ChooseDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseDeckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
