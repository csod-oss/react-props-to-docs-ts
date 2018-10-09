import * as React from 'react';
import { PropDoc } from './props-parser';
const Table = 'table', Thead = 'thead', Tr = 'tr', Th = 'th', Tbody = 'tbody', Td = 'td';

function humanizeDefaultValue(val) {
  if(!val || Array.isArray(val)) return val;
  if(typeof val === 'object') return 'Object';
  return val;
}

function addDefaultValuesToPropDoc(propDoc: PropDoc, component: React.ComponentType) {
  if(!component || !propDoc) return propDoc;
  const { defaultProps = {} } = component;
  Object.keys(propDoc).forEach(propName => {
    if(defaultProps[propName] && !propDoc[propName].defaultValue) {
      propDoc[propName].defaultValue = humanizeDefaultValue(defaultProps[propName]);
    }
  });
  return propDoc;
}

const PropsTable: React.SFC<{docs: PropDoc, component: React.ComponentType}> = ({docs, component}) => {
  if(!docs || !component) return null;
  docs = addDefaultValuesToPropDoc(docs, component);
  return (
    <React.Fragment>
      <Table>
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Type</Th>
            <Th>Required</Th>
            <Th>Default</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {docs &&
            Object.keys(docs).map(docKey => {
              const {defaultValue, description, required, typeText} = docs[docKey];
              return (
                <Tr key={docKey}>
                  <Td data-label="Prop">{docKey}</Td>
                  <Td data-label="Type">{typeText}</Td>
                  <Td data-label="Required">{String(required)}</Td>
                  <Td data-label="Default">{`${defaultValue}`}</Td>
                  <Td data-label="Description">{description}</Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </React.Fragment>
  );
}

export { PropsTable };