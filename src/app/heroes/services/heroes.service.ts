import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../../environments/environments';
import { Hero } from '../interfaces/hero.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http
      .get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http
      .get<Hero[]>(`${this.baseUrl}/heroes`)
      .pipe(
        map((heroes) =>
          heroes.filter((hero) =>
            hero.superhero.toLowerCase().includes(query.toLowerCase())
          )
        )
      );
  }

  //CRUD

  // create
  addHero(hero: Hero): Observable<Hero> {
    const newHero = { ...hero, id: uuidv4() };
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, newHero);
  }

  generateId(): number {
    return Math.floor(Math.random() * 10000); // Genera un id aleatorio
  }
  // Update
  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero is is required');

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }
  // Delete
  deleteHeroById(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/heroes/${id}`).pipe(
      catchError((err) => of(false)),
      map((resp) => true)
    );
  }
  // Listar
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }
}
