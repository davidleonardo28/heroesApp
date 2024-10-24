import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap } from 'rxjs/operators';

import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [],
})
export class SearchPageComponent {
  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;

  constructor(private heroesService: HeroesService) {}

  ngOnInit() {
    this.searchInput.valueChanges
      .pipe(
        filter((value) => value !== null && value.length > 0), // Asegura que el valor no sea nulo y no esté vacío
        debounceTime(300), // Añade un pequeño retraso para evitar llamadas excesivas
        switchMap((value) => this.heroesService.getSuggestions(value as string)) // 'value as string' asume que el valor no es nulo después del filtro
      )
      .subscribe((heroes) => (this.heroes = heroes));
  }

  searchHero() {
    const value: string = this.searchInput.value ?? ''; // Usa coalescencia nula para asegurar un string
    this.heroesService.getSuggestions(value).subscribe((heroes) => {
      this.heroes = heroes;
    });
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);

    this.selectedHero = hero;
  }
}
