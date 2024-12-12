import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectHomeComponent } from './redirect-home.component';

describe('RedirectHomeComponent', () => {
  let component: RedirectHomeComponent;
  let fixture: ComponentFixture<RedirectHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
