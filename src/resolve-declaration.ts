import * as path from 'path';
import * as fs from 'fs';

export const requireComponent = (pkg: string) => require(pkg);

export const resolveDeclarationPath = (pkg: string) => {
  const packagePath = require.resolve(pkg);
  const moduleName = path.basename(packagePath, '.js'), packageDir = path.dirname(packagePath);
  const declarationPath = path.join(packageDir, `${moduleName}.d.ts`);
  fs.accessSync(declarationPath);
  return declarationPath;
};
