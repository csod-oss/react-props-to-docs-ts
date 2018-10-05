# react-props-to-docs-ts
`npm install @csod-oss/react-props-to-docs-ts --save-dev`

Parse out documentation from the typescript interface that defines a React component's props.

```Javascript

import { propsParser } from '@csod-oss/react-props-to-docs-ts';
const docs = docsParser($packageName, component);

```

1. Find declaration file (*.d.ts) based on component name
    - accept declaration filename paramater in options
    - use require.resolve to locate declaration
2. Parse file and search for Component to retreive the documenting interface from its jsdoc comment
3. Search for interface, retreive properties and corresponding typings with jsdocs
