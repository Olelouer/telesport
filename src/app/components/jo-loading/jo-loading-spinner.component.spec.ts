import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoLoadingComponent } from './jo-loading.component';

describe('JoLoadingComponent', () => {
  let component: JoLoadingComponent;
  let fixture: ComponentFixture<JoLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
