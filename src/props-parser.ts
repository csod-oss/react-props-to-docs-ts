import Project, { SourceFile } from 'ts-simple-ast';
import { checkPathOrThrow, resolveDeclarationPath } from './resolve-declaration';
import { getComponent } from './parser-utils';
import signale from 'signale';

export interface PropDoc {
  required: boolean;
  defaultValue?: any;
  typeText: any;
  description: string;
}

export interface PropDocs {
  [name: string]: PropDoc
}

const getPropsInterfaceProperties = (propsInterfaceNames: string[], sourceFile: SourceFile) => {
  return propsInterfaceNames.reduce((acc, interfaceName) => {
    const propsInterface = sourceFile.getInterface(interfaceName);
    if(propsInterface) acc.push(propsInterface.getProperties());
    return acc;
  }, []);
};

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
};

// todo: refactor, move out parser specific logic, provide error messages
export function propsParser(pkg: string, componentName: string, controlPath?: string): PropDocs {
  let declarationFilePath = controlPath || resolveDeclarationPath(pkg);
  try {
    checkPathOrThrow(declarationFilePath);
  }
  catch (e) {
    signale.error(`Declaration file does not exist: ${declarationFilePath}`);
    return null;
  }
  const project = new Project({
    addFilesFromTsConfig: false
  });
  const sourceFile = project.addExistingSourceFile(declarationFilePath);
  const componentType = getComponent(sourceFile, componentName);
  const [componentTypeDocs] = componentType.getJsDocs();
  if (!componentTypeDocs) return null;
  const propTag = componentTypeDocs.getTags().find(tag => tag.getName() === 'see');
  if (!propTag) return null;
  const propsInterfaceNames = propTag.getComment().trim().split(/\s*,\s*/);
  return propsTransform(getPropsInterfaceProperties(propsInterfaceNames, sourceFile));
}
