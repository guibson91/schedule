import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRegisterPage } from './room-register.page';

describe('RoomRegisterPage', () => {
  let component: RoomRegisterPage;
  let fixture: ComponentFixture<RoomRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomRegisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
