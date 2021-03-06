import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonaWithInterests } from 'src/app/models/persona/PersonaWithInterests';

import { PersonaRecommendationsCardComponent } from './persona-recommendations-card.component';

describe('PersonaRecommendationsCardComponent', () => {
  let component: PersonaRecommendationsCardComponent;
  let fixture: ComponentFixture<PersonaRecommendationsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonaRecommendationsCardComponent ]
    })
    .compileComponents();


    fixture = TestBed.createComponent(PersonaRecommendationsCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
