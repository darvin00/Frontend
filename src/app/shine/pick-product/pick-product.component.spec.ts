/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PickProductComponent } from './pick-product.component';

describe('PickProductComponent', () => {
  let component: PickProductComponent;
  let fixture: ComponentFixture<PickProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
