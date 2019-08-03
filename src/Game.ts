import { BehaviorSubject, interval, Observable, fromEvent, combineLatest, Subscription } from 'rxjs';
import { switchMap, scan, startWith, map, tap, takeWhile } from 'rxjs/operators';
import { Letters, Letter, State } from './interfaces';

export const ALPHABET_LENGTH = 26;
export const LEVEL_CHANGE_THRESHOLD = 20;
const speedAdjust = 50;
const endThreshold = 15;
const charCellWidth = 30;

export class Game {

  private subs = new Subscription();
  
  private intervalSubject = new BehaviorSubject(600);

  private keys$: Observable<string> = fromEvent(document, 'keydown')
    .pipe(
      startWith({ key: ''} ),
      map((e: KeyboardEvent) => e.key)
    );
    
  killGame(): void {
    this.subs.unsubscribe();
  }

  startGame(): void {
    const gameState$ = this.getGameState();
    
    this.subs.add(
      gameState$.subscribe()
    );
  }

  getInitialGameState(): State {
    return { score: 0, letters: [], level: 1 };
  }
      
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

  getRender(state: State): string {
    let render = `Score: ${state.score}, Level: ${state.level} <br>`;

    return render;
  }

  getRandom(): number {
    const ran = Math.random();
    return ran < 1 ? ran : 0.99;
  }
  
  randomLetter(): string {
    const randomLetterCode: number = this.getRandom() * ALPHABET_LENGTH;
    const aCode: number = 'a'.charCodeAt(0);
    
    return String.fromCharCode(aCode + randomLetterCode);
  }
  
  getGameState(): Observable<State> {
    const letters$ = this.getLetters();
    const seed: State = this.getInitialGameState();

    return combineLatest(this.keys$, letters$)
      .pipe(
        // tap<[string, Letters]>(([keys, letters]) => console.log('--', keys, letters)),
        scan((accState: State, [key, letters]: [string, Letters]) => {

          const lastLetter: Letter = letters.ltrs[letters.ltrs.length - 1];
          
          if (lastLetter && lastLetter.letter === key) {
            this.onScoreSuccess(accState, letters.ltrs);
          }
          
          const isLevelUp: boolean = accState.score > 0 && accState.score % LEVEL_CHANGE_THRESHOLD === 0;
          if (isLevelUp) {
            this.onLevelUp(letters, accState);
          }

          return { score: accState.score, letters: letters.ltrs, level: accState.level };
        }, seed),
        // tap((state) => console.log(state)),
        takeWhile(state => state.letters.length < endThreshold)
      );
  }

  private onScoreSuccess(state: State, letters: Letter[]): void {
    state.score += 1;
    letters.pop();
  }

  private onLevelUp(letters: Letters, state: State): void {
    letters.ltrs = [];
    state.level += 1;
    this.intervalSubject.next(letters.intrvl - speedAdjust);
  }
}
