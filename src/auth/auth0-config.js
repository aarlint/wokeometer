export const auth0Config = {
  domain: "dev-ryw4cjvd.us.auth0.com",
  clientId: "3wvX0GLEhEefoH9BQEfth5AACHEwhfks",
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: "openid profile email"
  },
  logoutParams: {
    returnTo: `${window.location.origin}/login`
  },
  cacheLocation: "localstorage"
}; 