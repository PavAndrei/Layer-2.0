import { GOOGLE_CLIENT_ID } from './google-auth-config';

const GOOGLE_IDENTITY_SCRIPT_ID = 'google-identity-service-script';
const GOOGLE_IDENTITY_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const GOOGLE_AUTH_SCOPE = 'openid email profile';

type GoogleAuthorizationCodeResponse = {
  code?: string;
  error?: string;
  error_description?: string;
};

type GoogleCodeClient = {
  requestCode(): void;
};

type GoogleOAuth2Api = {
  initCodeClient(options: {
    callback: (response: GoogleAuthorizationCodeResponse) => void;
    client_id: string;
    scope: string;
    ux_mode: 'popup';
  }): GoogleCodeClient;
};

type GoogleIdentityApi = {
  accounts?: {
    oauth2?: GoogleOAuth2Api;
  };
};

type GoogleIdentityWindow = Window &
  typeof globalThis & {
    google?: GoogleIdentityApi;
  };

let googleIdentityScriptPromise: Promise<void> | null = null;

const getGoogleOAuth2 = (): GoogleOAuth2Api | null => {
  const googleIdentity = (window as GoogleIdentityWindow).google;

  return googleIdentity?.accounts?.oauth2 ?? null;
};

export const loadGoogleIdentityService = (): Promise<void> => {
  if (getGoogleOAuth2()) {
    return Promise.resolve();
  }

  if (googleIdentityScriptPromise) {
    return googleIdentityScriptPromise;
  }

  googleIdentityScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_IDENTITY_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), {
        once: true,
      });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load Google Identity Services')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');

    script.async = true;
    script.defer = true;
    script.id = GOOGLE_IDENTITY_SCRIPT_ID;
    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener(
      'error',
      () => reject(new Error('Failed to load Google Identity Services')),
      { once: true },
    );

    document.head.appendChild(script);
  });

  return googleIdentityScriptPromise;
};

export const requestGoogleAuthorizationCode = async (
  onCode: (code: string) => void,
  onError: () => void,
): Promise<void> => {
  await loadGoogleIdentityService();

  const googleOAuth2 = getGoogleOAuth2();

  if (!googleOAuth2) {
    throw new Error('Google Identity Services is unavailable');
  }

  const codeClient = googleOAuth2.initCodeClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: GOOGLE_AUTH_SCOPE,
    ux_mode: 'popup',
    callback: (response) => {
      if (response.error || !response.code) {
        onError();
        return;
      }

      onCode(response.code);
    },
  });

  codeClient.requestCode();
};
