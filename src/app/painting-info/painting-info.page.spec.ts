import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaintingInfoPage } from './painting-info.page';

describe('PaintingInfoPage', () => {
  let component: PaintingInfoPage;
  let fixture: ComponentFixture<PaintingInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintingInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
