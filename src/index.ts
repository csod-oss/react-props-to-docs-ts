import Project from 'ts-simple-ast';
import { resolveDeclarationPath, requireComponent } from './resolve-declaration';
import { getComponent } from './parser-utils';

export interface PropDoc {
  required: boolean;
  defaultValue: any;
  typeText: any;
  description: string;
}

export interface PropDocs {
  [name: string]: PropDoc
}

// todo: refactor, move out parser specific logic, provide error messages
export function propsParser(pkg: string): PropDocs {
  let declarationFile, component, componentName;
  try {
    declarationFile = resolveDeclarationPath(pkg);
    component = requireComponent(pkg);
    componentName = component.name;
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
  const { defaultProps = {} } = component;
  return propsInterfaceProperties.reduce((acc, prop) => {
    const propName = prop.getName();
    const required = !prop.getQuestionTokenNode();
    const [propDoc] = prop.getJsDocs();
    return {
      ...acc,
      [propName]: {
        required,
        defaultValue: defaultProps[propName],
        typeText: prop.getTypeNode().getFullText().trim(),
        description: propDoc ? propDoc.getComment().trim() : ''
      }
    };
  }, {});
}
