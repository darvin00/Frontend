/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SkinCareComponent } from './Skin-care.component';

describe('SkinCareComponent', () => {
  let component: SkinCareComponent;
  let fixture: ComponentFixture<SkinCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkinCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkinCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
