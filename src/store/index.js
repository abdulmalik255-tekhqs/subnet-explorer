import { init } from '@rematch/core';
import models from './models';
import immerPlugin from '@rematch/immer';

export const store = init({
  models: models,
  plugins: [immerPlugin()],
});
