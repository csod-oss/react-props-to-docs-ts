import * as path from 'path';
import * as fs from 'fs';
import * as decamelize from 'decamelize';

const hyphenize = (name: string): string => decamelize(name);

const possibleDeclarationFilenames = (packagePath: string, componentName: string) => {
  return [ ...new Set([
    componentName,
    componentName.toLowerCase(),
    hyphenize(componentName)
  ])].map(name => path.join(packagePath, `${name}.d.ts`));
};

export const resolveDeclarationPath = (pkg: string, componentName: string) => {
  const packagePath = path.dirname(require.resolve(pkg));
  const filenames = possibleDeclarationFilenames(packagePath, componentName);
  return filenames.find(fs.existsSync);
};

export const getComponentName = (component: InstanceType<any>) => component.name;

