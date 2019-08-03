import { Game, ALPHABET_LENGTH, LEVEL_CHANGE_THRESHOLD } from './Game';
import { Letters, State, Letter } from './interfaces';
import { Subscription, of } from 'rxjs';

describe('randomLetter', () => {
  let game: Game;
  const LETTER_CHUNK = 1 / ALPHABET_LENGTH;
  const TINIEST_AMOUNT = 0.000001;

  beforeEach(() => {
    game = new Game();
  });

  it(`returns 'a' when 'getRandom' returns 0`, () => {
    spyOn(game, 'getRandom').and.returnValue(0);
    expect(game.randomLetter()).toBe('a');
  });

  it(`returns 'a' when 'getRandom' returns just less than ${LETTER_CHUNK}`, () => {
    spyOn(game, 'getRandom').and.returnValue(LETTER_CHUNK - TINIEST_AMOUNT);
    expect(game.randomLetter()).toBe('a');
  });

  it(`returns 'b' when 'getRandom' returns ${LETTER_CHUNK}`, () => {
    spyOn(game, 'getRandom').and.returnValue(LETTER_CHUNK);
    expect(game.randomLetter()).toBe('b');
  });

  it(`returns 'z' when 'getRandom' returns just less than 1`, () => {
    spyOn(game, 'getRandom').and.returnValue(1 - TINIEST_AMOUNT);
    expect(game.randomLetter()).toBe('z');
  });

  it(`returns 'z' when 'getRandom' returns ${1 - LETTER_CHUNK}`, () => {
    spyOn(game, 'getRandom').and.returnValue(1 - LETTER_CHUNK);
    expect(game.randomLetter()).toBe('z');
  });

  it(`returns 'y' when 'getRandom' returns ${1 - LETTER_CHUNK} minus tiniest amount`, () => {
    spyOn(game, 'getRandom').and.returnValue(1 - LETTER_CHUNK - TINIEST_AMOUNT);
    expect(game.randomLetter()).toBe('y');
  });
});

describe('getLetters', () => {
  let game: Game;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  beforeEach(() => {
    game = new Game();
  });

  it(`adds 2 random letters to result`, (done) => {
    let count = 0;
    const subs: Subscription = game.getLetters()
      .subscribe( (letters: Letters) => {
        
        count++;
        if (count === 2) {
          expect(letters.ltrs.length).toBe(2);
          expect(alphabet.indexOf(letters.ltrs[0].letter)).not.toBe(-1);
          
          subs.unsubscribe();
          done();
        }
      });
  });
});

describe('getGameState', () => {
  let game: Game;
  let subs: Subscription = new Subscription();

  const getLetters = (): Letter[] => ([
    { letter: 'a', yPos: 0 },
    { letter: 'b', yPos: 0 },
    { letter: 'c', yPos: 0 }
  ]);

  beforeEach(() => {
    game = new Game();
  });

  afterEach(() => {
    subs.unsubscribe();
  })

  it(`score and level should stay same as seed when no keys passed, but letters accumulate`, () => {

    game['keys$'] = of('z');
    
    spyOn(game, 'getLetters').and.returnValue(of({
      ltrs: getLetters(),
      intrvl: 600
    }));

    let curState: State;
    subs.add(
      game.getGameState()
        .subscribe(state => {
          curState = state;
        })
    );

    expect(curState).toEqual({ score: 0, letters: getLetters(), level: 1 });
  });

  it(`score should increment when key is passed that matches last letter`, () => {
    game['keys$'] = of('c');

    spyOn(game, 'getLetters').and.returnValue(of({
      ltrs: getLetters(),
      intrvl: 600
    }));

    let curState: State;
    subs.add(
      game.getGameState()
        .subscribe(state => {
          curState = state;
        })
    );

    const letters = getLetters();
    letters.pop();
    expect(curState).toEqual({ score: 1, letters, level: 1 });
  });

  it(`level and speed ('intervalSubject') should increment when scrore reaches 'LEVEL_CHANGE_THRESHOLD'`, () => {
    spyOn(game, 'getInitialGameState').and.returnValue(
      { score: LEVEL_CHANGE_THRESHOLD-1, letters: [], level: 1 }
    );

    game['keys$'] = of('c');

    spyOn(game, 'getLetters').and.returnValue(of({
      ltrs: getLetters(),
      intrvl: 600
    }));

    let score: number;
    let level: number;
    subs.add(
      game.getGameState()
        .subscribe(state => {
          score = state.score;
          level = state.level;
        })
    );

    expect(score).toBe(LEVEL_CHANGE_THRESHOLD);
    expect(game['levelBumped']).toBe(true);
    expect(level).toBe(2);
  });

  it(`level and speed ('intervalSubject') should increment when scrore reaches 'LEVEL_CHANGE_THRESHOLD' * 2`, () => {

    const multiplier = 3;
    
    spyOn(game, 'getInitialGameState').and.returnValue(
      { score: (LEVEL_CHANGE_THRESHOLD * multiplier)-1, letters: [], level: multiplier-1 }
    );

    game['keys$'] = of('c');

    spyOn(game, 'getLetters').and.returnValue(of({
      ltrs: getLetters(),
      intrvl: 600
    }));

    let score: number;
    let level: number;
    subs.add(
      game.getGameState()
        .subscribe(state => {
          score = state.score;
          level = state.level;
        })
    );

    expect(score).toBe(LEVEL_CHANGE_THRESHOLD * multiplier);
    expect(game['levelBumped']).toBe(true);
    expect(level).toBe(multiplier);
  });
});