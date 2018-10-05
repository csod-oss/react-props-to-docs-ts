import { SourceFile } from "ts-simple-ast";

export function getComponent(sourceFile: SourceFile, componentName: string) {
  return sourceFile.getClass(componentName) || sourceFile.getFunction(componentName);
};