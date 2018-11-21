import Project from 'ts-simple-ast';
import { resolveDeclarationPath } from './resolve-declaration';
import { getComponent } from './parser-utils';
const util = require('util');
let glob = require('glob');
glob = util.promisify(glob);

export interface PropDoc {
  required: boolean;
  defaultValue?: any;
  typeText: any;
  description: string;
}

export interface PropDocs {
  [name: string]: PropDoc
}

const propsTransform = (propsInterfaceProperties) => {
  return propsInterfaceProperties.reduce((acc, prop) => {
    const propName = prop.getName();
    const required = !prop.getQuestionTokenNode();
    const [propDoc] = prop.getJsDocs();
    return {
      ...acc,
      [propName]: {
        required,
        typeText: prop.getTypeNode().getFullText().trim(),
        description: propDoc ? propDoc.getComment().trim() : ''
      }
    };
  }, {});
}

// todo: refactor, move out parser specific logic, provide error messages
export function propsParser(pkg: string, componentName: string): PropDocs {
  let declarationFile;
  try {
    declarationFile = resolveDeclarationPath(pkg);
  }
  catch (e) {
    return null;
  }
  const project = new Project({
    addFilesFromTsConfig: false
  });
  const sourceFiles = project.addExistingSourceFiles('');
  const sourceFile = project.addExistingSourceFile(declarationFile);
  const componentType = getComponent(sourceFile, componentName);
  const [componentTypeDocs] = componentType.getJsDocs();
  if (!componentTypeDocs) return null;
  const propTag = componentTypeDocs.getTags().find(tag => tag.getName() === 'see');
  if (!propTag) return null;
  const propsInterfaceNames = propTag.getComment().trim().split(/\s*,\s*/);
  const propsInterfaces = propsInterfaceNames.map(i => sourceFile.getInterface(i));
  if (propsInterfaces.length === 0) return null;
  const propsInterfaceProperties = propsInterface.getProperties();
  return propsTransform(propsInterfaceProperties);
}

function getComponents(sourceFiles: SourceFile [], componentName: string) {
  return sourceFile.getClass(componentName) || sourceFile.getFunction(componentName);
};

function propsParser2(packageNames) {
  //const packagesData = getDeclarationFilePaths(packageNames);
  for(const packageName of packageNames) {
    const packagePath = `./node_modules/${packageName}`;
    const declarationFilesGlob = `${packagePath}/**/*.d.ts`;
    const project = new Project({
      addFilesFromTsConfig: false
    });
    const sourceFiles = project.addExistingSourceFiles(declarationFilesGlob);
    sourceFiles
  }
}