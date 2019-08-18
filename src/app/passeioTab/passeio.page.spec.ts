import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PasseioPage } from './passeio.page';

describe('Tab1Page', () => {
  let component: PasseioPage;
  let fixture: ComponentFixture<PasseioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasseioPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PasseioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
