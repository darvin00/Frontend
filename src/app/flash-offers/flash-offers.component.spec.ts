/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlashOffersComponent } from './flash-offers.component';

describe('FlashOffersComponent', () => {
  let component: FlashOffersComponent;
  let fixture: ComponentFixture<FlashOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
