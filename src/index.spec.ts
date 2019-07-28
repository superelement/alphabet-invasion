import { Game, ALPHABET_LENGTH } from './index';

describe('randomLetter', () => {
  let game: Game;
  const LETTER_CHUNK = 1 / ALPHABET_LENGTH;
  const TINIEST_AMOUNT = 0.000001;

  beforeEach(() => {
    game = new Game();
  })

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