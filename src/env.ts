import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  GITHUB_TOKEN: {
    description: 'Personal access token used to read blog content from GitHub issues',
  },
});
