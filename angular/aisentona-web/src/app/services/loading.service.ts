import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor() {}

  // Método para mostrar o spinner
  show(): void {
    this.loadingSubject.next(true);
  }

  // Método para esconder o spinner
  hide(): void {
    this.loadingSubject.next(false);
  }
}
