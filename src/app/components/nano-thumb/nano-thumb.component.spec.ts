import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NanoThumbComponent } from './nano-thumb.component';

describe('NanoThumbComponent', () => {
  let component: NanoThumbComponent;
  let fixture: ComponentFixture<NanoThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NanoThumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NanoThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
