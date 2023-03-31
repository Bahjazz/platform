const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 10;
const PASSWORD_MIN_LENGTH = 2;

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

  if (PASSWORD_MIN_LENGTH> account.password.length) {
    errors.push("passwordTooShort");
  }

  return errors;
};

exports.getErrorsForLogIn = function (account) {
  const errors = [];
 
  if (!account.username) {
    errors.push("usernameMissing");
  }

  if (account.username.length < MIN_USERNAME_LENGTH && !!account.username) {
    errors.push("usernameTooShort");
  }

  if (MAX_USERNAME_LENGTH < account.username.length) {
    errors.push("usernameTooLong");
  }

  if (PASSWORD_MIN_LENGTH > account.password.length) {
    errors.push("passwordTooShort");
  }

  return errors
};
