import * as path from 'path';
import * as fs from 'fs';

export const checkPathOrThrow = filePath => fs.accessSync(filePath);

export const resolveDeclarationPath = (pkg: string) => {
  const packagePath = require.resolve(pkg);
  const moduleName = path.basename(packagePath, '.js'), modulePath = path.dirname(packagePath);
  return path.join(modulePath, `${moduleName}.d.ts`);
};
