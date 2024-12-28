/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FaceCareComponent } from './face-care.component';

describe('FaceCareComponent', () => {
  let component: FaceCareComponent;
  let fixture: ComponentFixture<FaceCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
