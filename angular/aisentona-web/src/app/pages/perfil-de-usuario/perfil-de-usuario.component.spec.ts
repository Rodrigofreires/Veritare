import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDeUsuarioComponent } from './perfil-de-usuario.component';

describe('PerfilDeUsuarioComponent', () => {
  let component: PerfilDeUsuarioComponent;
  let fixture: ComponentFixture<PerfilDeUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilDeUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilDeUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
