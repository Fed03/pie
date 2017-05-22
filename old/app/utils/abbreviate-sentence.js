export default function abbreviateSentence(string) {
  let words = string.split(/\s/);
  let abbreviation;
  if (words.length > 1) {
    abbreviation = words[0][0] + words[1][0];
  } else {
    string = words[0];
    abbreviation = string[0];
    if (string.length > 1) {
      string = string.replace(/[aeiou]/g, '');
      abbreviation += string[1];
    }
  }

  return abbreviation;
}
