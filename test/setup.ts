import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (e) {}
});

global.afterEach(async () => {
  try {
    await getConnection().close();
  } catch (e) {}
});
