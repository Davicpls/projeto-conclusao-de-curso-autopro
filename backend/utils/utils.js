function isIntegerGreaterThanZero(valor) {
  return Number.isInteger(valor) && valor > 0;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(String(email).trim());
}

module.exports = {
  isIntegerGreaterThanZero,
  isValidEmail
};
