import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevaPage } from './nueva.page';

describe('NuevaPage', () => {
  let component: NuevaPage;
  let fixture: ComponentFixture<NuevaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
