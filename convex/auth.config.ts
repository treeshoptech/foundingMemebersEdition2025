const clientId = 'client_01K9HJZ1TA48RKQ41YPRFTFWA9';

const authConfig = {
  providers: [
    {
      type: 'customJwt' as const,
      issuer: `https://api.workos.com/`,
      algorithm: 'RS256' as const,
      applicationID: clientId,
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
    },
    {
      type: 'customJwt' as const,
      issuer: `https://api.workos.com/user_management/${clientId}`,
      algorithm: 'RS256' as const,
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
    },
  ],
};

export default authConfig;
