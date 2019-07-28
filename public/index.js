var randomLetter = function () {
    var aCode = 'a'.charCodeAt(0);
    var zCode = 'z'.charCodeAt(0);
    var randomLetterCode = Math.round(Math.random() * (zCode - aCode));
    return String.fromCharCode(randomLetterCode + aCode);
};
console.log(randomLetter());
//# sourceMappingURL=index.js.map