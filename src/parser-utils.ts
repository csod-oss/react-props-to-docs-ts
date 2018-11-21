import { SourceFile, SyntaxKind } from "ts-simple-ast";

export function getComponent(sourceFile: SourceFile, componentName: string) {
  return sourceFile.getClass(componentName) || sourceFile.getFunction(componentName);
};

export function getReactComponents(sourceFiles: SourceFile []) {
  let result = new Map();
  for(const sourceFile of sourceFiles) {
    const classes = sourceFile.getClasses();
    classes[0].getExtends()
    const functions = sourceFile.getFunctions();
    result.set(sourceFile, )
  }
  return sourceFile.getClass(componentName) || sourceFile.getFunction(componentName);
};