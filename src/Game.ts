import { BehaviorSubject, interval, Observable, fromEvent, combineLatest, Subscription } from 'rxjs';
import { switchMap, scan, startWith, map, tap, takeWhile } from 'rxjs/operators';
import { Letters, Letter, State } from './interfaces';

export const ALPHABET_LENGTH = 26;
export const LEVEL_CHANGE_THRESHOLD = 20;
const speedAdjust = 50;
const endThreshold = 15;
const charCellWidth = 30;

export class Game {

  private levelBumped = false;
  
  private subs = new Subscription();
  
  private intervalSubject: BehaviorSubject<number> = new BehaviorSubject(600);

  private keys$: Observable<string> = fromEvent(document, 'keydown')
    .pipe(
      startWith({ key: ''} ),
      map((e: KeyboardEvent) => e.key)
    );
    
  killGame(): void {
    this.subs.unsubscribe();
  }

  startGame(): void {

    this.intervalSubject = new BehaviorSubject(600);
    
    this.subs.add(
      this.getGameState()
        .subscribe(
          (state: State) => {
            document.body.innerHTML = this.getRender(state);
          },
          () => {},
          () => {
            document.body.innerHTML += '<br>Game Over! <br> <button type="button">Play again?</button>';
            fromEvent(document.querySelector('button'), 'click')
              .subscribe(() => {
                document.body.innerHTML = '';
                this.startGame();
              });
          }
        )
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
            this.levelBumped = false;
          }
          
          const isLevelUp: boolean = !this.levelBumped && accState.score > 0 && accState.score % LEVEL_CHANGE_THRESHOLD === 0;

          if (isLevelUp) {
            this.onLevelUp(letters, accState);
          }

          return { score: accState.score, letters: letters.ltrs, level: accState.level };
        }, seed),
        // tap((state) => console.log(state)),
        takeWhile(state => state.letters.length < endThreshold)
      );
  }

  private getRender(state: State): string {
    return `Score: ${state.score}, Level: ${state.level} <br>
      ${this.getLettersRender(state)}
      ${this.getBaseline(state)}`;
  }

  private getBaseline(state: State): string {
    return '<br>'.repeat(endThreshold - state.letters.length - 1) + '-'.repeat(charCellWidth);
  }

  private getLettersRender(state: State): string {
    return state.letters.map(l => '&nbsp;'.repeat(l.yPos) + l.letter + '<br>').join('');
  }

  private onScoreSuccess(state: State, letters: Letter[]): void {
    state.score += 1;
    letters.pop();
  }

  private onLevelUp(letters: Letters, state: State): void {
    letters.ltrs = [];
    state.level += 1;
    this.levelBumped = true;
    this.intervalSubject.next(letters.intrvl - speedAdjust);
  }

}
