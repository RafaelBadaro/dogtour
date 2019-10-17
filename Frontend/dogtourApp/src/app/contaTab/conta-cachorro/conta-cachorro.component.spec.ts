import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaCachorroComponent } from './conta-cachorro.component';

describe('ContaCachorroComponent', () => {
  let component: ContaCachorroComponent;
  let fixture: ComponentFixture<ContaCachorroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaCachorroComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaCachorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
