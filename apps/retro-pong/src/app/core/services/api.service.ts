import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseHref = `${location.origin}/api/`;

  constructor() {
    console.log('baseHref', this.baseHref);
  }
}
