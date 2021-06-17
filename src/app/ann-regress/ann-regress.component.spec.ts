import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnRegressComponent } from './ann-regress.component';

describe('AnnRegressComponent', () => {
  let component: AnnRegressComponent;
  let fixture: ComponentFixture<AnnRegressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnRegressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnRegressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
