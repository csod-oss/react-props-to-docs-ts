import * as path from 'path';
import * as fs from 'fs';

export const resolveDeclarationPath = (pkg: string, filePath: string) => {
  const packagePath = require.resolve(path.join(pkg, filePath || ''));
  const moduleName = path.basename(packagePath, '.js'), modulePath = path.dirname(packagePath);
  const declarationPath = path.join(modulePath, `${moduleName}.d.ts`);
  fs.accessSync(declarationPath);
  return declarationPath;
};