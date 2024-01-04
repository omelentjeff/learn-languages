const validateResult = (query, result) => {
  const correctWord = Object.values(result)[0].finnish_word.toLowerCase();

  if (query === correctWord) {
    return true;
  } else {
    return false;
  }
};

module.exports = { validateResult };
