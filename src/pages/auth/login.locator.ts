export const loginLocators = {
  usernameInput: '[data-test="username"]',
  passwordInput: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  loginLogo: '.login_logo',
  errorMessage: '[data-test="error"]',
  acceptedUsernames: '#login_credentials',
  passwordHint: '.login_password'
} as const;

