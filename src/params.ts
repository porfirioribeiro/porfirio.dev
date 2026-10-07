import { defineParams } from '@sveltejs/kit/params';

export const matchInteger = (param: string) => (/^\d+$/.test(param) ? Number(param) : undefined);

export const params = defineParams({
  integer: matchInteger,
});
