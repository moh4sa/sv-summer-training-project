import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionsPage } from './departments.page';

describe('SectionsPage', () => {
  let component: SectionsPage;
  let fixture: ComponentFixture<SectionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
