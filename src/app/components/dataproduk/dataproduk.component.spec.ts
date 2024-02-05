import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataprodukComponent } from './dataproduk.component';

describe('DataprodukComponent', () => {
  let component: DataprodukComponent;
  let fixture: ComponentFixture<DataprodukComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataprodukComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataprodukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
