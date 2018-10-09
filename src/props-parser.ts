import Project from 'ts-simple-ast';
import { resolveDeclarationPath } from './resolve-declaration';
import { getComponent } from './parser-utils';

export interface PropDoc {
  required: boolean;
  defaultValue?: any;
  typeText: any;
  description: string;
}

export interface PropDocs {
  [name: string]: PropDoc
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
  const sourceFile = project.addExistingSourceFile(declarationFile);
  const componentType = getComponent(sourceFile, componentName);
  const [componentTypeDocs] = componentType.getJsDocs();
  if (!componentTypeDocs) return null;
  const propTag = componentTypeDocs.getTags().find(tag => tag.getName() === 'see');
  if (!propTag) return null;
  const propsInterfaceName = propTag.getComment().trim();
  const propsInterface = sourceFile.getInterface(propsInterfaceName);
  if (!propsInterface) return null;
  const propsInterfaceProperties = propsInterface.getProperties();
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
