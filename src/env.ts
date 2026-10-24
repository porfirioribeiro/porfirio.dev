import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  GITHUB_TOKEN: {
    description:
      'Personal access token used to read blog content from GitHub issues. Optional: without it, requests are anonymous (60/hour rate limit) — see createGH.',
    schema: (value) => value,
  },
});
