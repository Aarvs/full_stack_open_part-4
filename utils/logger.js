const info = (...params) => {
  // we used rest operator to collect any number of arguments we pass in info function.
  // spread operator to spread the elements of the 'params' array as separate arguments to the console.log or console.error.
  console.log(...params);
};

const error = (...params) => {
  console.log(...params);
};

module.exports = {
  info,
  error,
};
