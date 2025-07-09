const letterA = 64; // ASCII value of 'A' is 65, so - 64 makes 'A' = 1
const currentYear = new Date().getFullYear(); // Current year for validation (TODO - Create a separate utility file!!!!)

function carValue(model, year) {
    // Check if model and year are valid
    if (typeof model !== 'string' || model.trim() === '' || typeof year !== 'number') {
        throw new Error('Model must be a string and year must be a number');
    }

    // Check if the year has valid years
    if (year <= 1886 || year >= currentYear) {
        throw new Error('Invalid year');
    }

    // to uppercase and split into an array of letters
    const splitArray = model.toUpperCase().split('');

    // model value = summing the positions of letters in the alphabet
    const modelValue = splitArray.reduce((acc, letter) => {
        return acc + (letter.charCodeAt(0) - letterA); // Subtract A to get other letter values
    }, 0);

    // Calc and return the final car value
    return modelValue * 100 + year;
}

module.exports = carValue;
