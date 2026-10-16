// No dependencies: EAS runs this before installing packages.
function validatePreviewConfig(env) {
  if (env.EXPO_PUBLIC_ENABLE_QA_MODE !== 'true') {
    throw new Error('Controlled preview requires EXPO_PUBLIC_ENABLE_QA_MODE=true.');
  }
  let url;
  try {
    url = new URL((env.EXPO_PUBLIC_API_BASE_URL || '').trim());
  } catch {
    throw new Error('Set EXPO_PUBLIC_API_BASE_URL in the EAS preview environment to the deployed HTTPS API ending in /api/v1.');
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
      url.pathname.replace(/\/+$/, '') !== '/api/v1' ||
      /^(localhost|127\.|0\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[|example\.|.*\.example\.|.*\.invalid$|.*\.local$)/i.test(url.hostname) ||
      /[<>]/.test(url.hostname)) {
    throw new Error('Preview API must be a public HTTPS URL ending in /api/v1, without credentials, query parameters, or fragments.');
  }
  return url.href.replace(/\/+$/, '');
}

module.exports = { validatePreviewConfig };

if (require.main === module) {
  const hook = process.argv.includes('--eas-hook');
  if (!hook || process.env.EAS_BUILD_PROFILE === 'preview') {
    try {
      validatePreviewConfig(process.env);
      console.log('Controlled preview configuration passed.');
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
