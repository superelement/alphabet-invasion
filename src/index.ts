

const randomLetter = () => {
  const aCode: number = 'a'.charCodeAt(0);
  const zCode: number = 'z'.charCodeAt(0);
  const randomLetterCode: number = Math.round( Math.random() * (zCode - aCode) );
  
  return String.fromCharCode(randomLetterCode + aCode);
};

console.log(randomLetter())