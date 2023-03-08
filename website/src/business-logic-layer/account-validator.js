const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 10;
const MIN_PASSWORD_LENGHTH = 2;

exports.getErrorsNewAccount = function (account) {
  const errors = [];

  if (!account.hasOwnProperty("username")) {
    errors.push("usernameMissing");
  }

  if (account.username.length < MIN_USERNAME_LENGTH) {
    errors.push("usernameTooShort");
  }

  if (MAX_USERNAME_LENGTH < account.username.length) {
    errors.push("usernameTooLong");
  }

  if (MIN_PASSWORD_LENGHTH > account.password.length) {
    errors.push("passwordTooShort");
  }

  return errors;
};

exports.getErrorsForLogIn = function (account) {
  const errors = [];
  if (!account.username) {
    errors.push("usernameMissing");
  }

  if (account.username.length < MIN_USERNAME_LENGTH && !account.username) {
    errors.push("usernameMissing");
  }

  if (MAX_USERNAME_LENGTH < account.username.length) {
    errors.push("usernameTooLong");
  }

  if (MIN_PASSWORD_LENGHTH > account.password.length) {
    errors.push("passwordTooShort");
  }

  return errors
};
