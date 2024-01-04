const validateResult = (query, result) => {
  const userWord = Object.values(query)[0].toLowerCase();
  const correctWord = Object.values(result)[0].finnish_word.toLowerCase();
  if (userWord === correctWord) {
    return true;
  } else {
    return false;
  }
};

module.exports = { validateResult };
