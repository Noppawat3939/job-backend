export const getKeysHeaders = <T extends Record<string, unknown>>(headers: T) => {
  if (headers['api-key'] && headers['authorization']) {
    const [, token] = String(headers['authorization']).split(' ');

    return { token, apiKey: String(headers['api-key']) };
  }

  return { apiKey: String(headers['api-key']), token: undefined };
};
