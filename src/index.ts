import { BehaviorSubject } from 'rxjs';

export const ALPHABET_LENGTH = 26;
const levelChangeThreshold = 20;
const speedAdjust = 50;
const endThreshold = 15;
const gameWidth = 30;

export class Game {
  
  private intervalSubject = new BehaviorSubject(600);

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
console.log('1')