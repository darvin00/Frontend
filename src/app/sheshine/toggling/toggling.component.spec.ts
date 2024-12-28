/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TogglingComponent } from './toggling.component';

describe('TogglingComponent', () => {
  let component: TogglingComponent;
  let fixture: ComponentFixture<TogglingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TogglingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TogglingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
