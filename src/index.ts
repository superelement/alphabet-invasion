
export const ALPHABET_LENGTH = 26;

export class Game {
  
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

console.log('-', game.randomLetter())