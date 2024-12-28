import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsOffersComponent } from './discounts-offers.component';

describe('DiscountsOffersComponent', () => {
  let component: DiscountsOffersComponent;
  let fixture: ComponentFixture<DiscountsOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscountsOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountsOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
