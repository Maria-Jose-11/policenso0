import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosPersonalesPage } from './datos-personales.page';

describe('DatosPersonalesPage', () => {
  let component: DatosPersonalesPage;
  let fixture: ComponentFixture<DatosPersonalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPersonalesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPersonalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
