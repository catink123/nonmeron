import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageScrollService {
  savedScrollPosition: number | null = null;
  constructor() { }

  saveCurrentPosition() {
    this.savedScrollPosition = window.scrollY;
  }

  restoreSavedPosition() {
    if (this.savedScrollPosition && window.scrollY !== this.savedScrollPosition)
      window.scrollTo(0, this.savedScrollPosition);
  }
}
