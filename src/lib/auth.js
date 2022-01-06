import { SvelteKitAuth, Providers } from 'sk-auth';

const config = {
	id: 'cognito', // IMPORTANT: this is the id that we'll use to identify our provider
	accessTokenUrl: `${import.meta.env.COGNITO_DOMAIN}/oauth2/token`,
	authorizationUrl: `${import.meta.env.COGNITO_DOMAIN}/oauth2/authorize`,
	profileUrl: `${import.meta.env.COGNITO_DOMAIN}/oauth2/userInfo`,
	clientId: import.meta.env.COGNITO_CLIENT_ID,
	clientSecret: 'myAWSSecret',
	scope: 'openid',
	contentType: 'application/x-www-form-urlencoded'
};

const oauthProvider = new Providers.OAuth2Provider(config);

// exposing our auth object
export const appAuth = new SvelteKitAuth({
	providers: [oauthProvider]
});
