import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnGraphComponent } from './ann-graph.component';

describe('AnnGraphComponent', () => {
  let component: AnnGraphComponent;
  let fixture: ComponentFixture<AnnGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
