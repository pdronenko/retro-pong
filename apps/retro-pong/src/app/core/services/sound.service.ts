import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private soundLevel = 0.3;
  private backgroundMusic = new Audio('../../../assets/sounds/background_music_short.mp3');
  private wallBounceSound = new Audio('../../../assets/sounds/wall_bounce.wav');

  constructor() {
    this.backgroundMusic.preload = 'auto';
  }

  playWallBounceSound(): void {
    this.wallBounceSound.currentTime = 0;
    this.wallBounceSound.volume = this.soundLevel;
    this.wallBounceSound.play();
  }

  playBackgroundMusic(): void {
    this.backgroundMusic.currentTime = 0;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.soundLevel;
    this.backgroundMusic.play();
  }

  pauseBackgroundMusic(): void {
    this.backgroundMusic.pause();
  }
}
