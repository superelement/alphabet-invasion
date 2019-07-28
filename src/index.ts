import { BehaviorSubject, interval, Observable } from 'rxjs';
import { switchMap, scan } from 'rxjs/operators';
import { Letters, Letter } from './interfaces';

export const ALPHABET_LENGTH = 26;
const levelChangeThreshold = 20;
const speedAdjust = 50;
const endThreshold = 15;
const charCellWidth = 30;

export class Game {
  
  private intervalSubject = new BehaviorSubject(600);

  getLetters(): Observable<Letters> {
    return this.intervalSubject.pipe(
      switchMap(i => interval(i)
        .pipe(
          scan<number, Letters>( (acc, cur) => {
  
            const newLtr: Letter = {
              letter: this.randomLetter(),
              yPos: Math.floor(Math.random() * charCellWidth)
            };
  
            return {
              ltrs: [ ...[newLtr], ...acc.ltrs],
              intrvl: i
            }
          }, { ltrs: [], intrvl: 0 })
        )
      )
    );
  }

  getRandom(): number {
    const ran = Math.random();
    return ran < 1 ? ran : 0.99;
  }
  
  randomLetter(): string {
    const randomLetterCode: number = this.getRandom() * ALPHABET_LENGTH;
    const aCode: number = 'a'.charCodeAt(0);
    
    return String.fromCharCode(aCode + randomLetterCode);
  };
}

const game = new Game();
