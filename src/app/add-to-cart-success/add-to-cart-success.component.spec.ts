import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartSuccessComponent } from './add-to-cart-success.component';

describe('AddToCartSuccessComponent', () => {
  let component: AddToCartSuccessComponent;
  let fixture: ComponentFixture<AddToCartSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCartSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddToCartSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
