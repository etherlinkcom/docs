// Abbreviate account addresses
// Pass two numbers separated by a comma
// for the number of characters at the start and the end
export const getAbbreviation = (str, pattern) => {
  const [start, end] = pattern.split(',').map((num) => parseInt(num, 10));
  if ( isNaN(start) || isNaN(end) ) {
    throw 'Pass two numbers separated by a comma to abbreviate an address; received: ' + pattern;
  }
  // If the abbreviation is too short, return the whole thing
  if (start + end >= str.length) {
    return str;
  }
  return str.substring(0, start) + '...' + str.substring(str.length - end);
}
