/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KpnrunnerComponent } from './kpnrunner.component';

describe('KpnrunnerComponent', () => {
  let component: KpnrunnerComponent;
  let fixture: ComponentFixture<KpnrunnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpnrunnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpnrunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
