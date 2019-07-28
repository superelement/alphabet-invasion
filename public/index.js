"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
exports.ALPHABET_LENGTH = 26;
var levelChangeThreshold = 20;
var speedAdjust = 50;
var endThreshold = 15;
var gameWidth = 30;
var Game = /** @class */ (function () {
    function Game() {
        this.intervalSubject = new rxjs_1.BehaviorSubject(600);
    }
    Game.prototype.getRandom = function () {
        var ran = Math.random();
        return ran < 1 ? ran : 0.99;
    };
    Game.prototype.randomLetter = function () {
        var randomLetterCode = this.getRandom() * exports.ALPHABET_LENGTH;
        var aCode = 'a'.charCodeAt(0);
        return String.fromCharCode(aCode + randomLetterCode);
    };
    ;
    return Game;
}());
exports.Game = Game;
var game = new Game();
//# sourceMappingURL=index.js.map