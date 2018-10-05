import * as React from 'react';
import { PropDoc, addDefaultValuesToPropDoc } from './props-parser';

const Table = 'table', Thead = 'thead', Tr = 'tr', Th = 'th', Tbody = 'tbody', Td = 'td';

const PropsTable: React.SFC<{docs: PropDoc, component: React.ComponentType}> = ({docs, component}) => {
  if(!docs || !component) return null;
  docs = addDefaultValuesToPropDoc(docs, component);
  return (
    <React.Fragment>
      <Table className="p-table table-layout-auto p-table-striped">
        <Thead>
          <Tr>
            <Th className="PropsTable--property">Property</Th>
            <Th className="PropsTable--type">Type</Th>
            <Th className="PropsTable--required">Required</Th>
            <Th className="PropsTable--default">Default</Th>
            <Th className="PropsTable--description">Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {docs &&
            Object.keys(docs).map(docKey => {
              const {defaultValue, description, required, typeText} = docs[docKey];
              return (
                <Tr key={docKey}>
                  <Td>{docKey}</Td>
                  <Td>{typeText}</Td>
                  <Td>{String(required)}</Td>
                  <Td>{`${defaultValue}`}</Td>
                  <Td>{description}</Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
    </React.Fragment>
  );
}

export { PropsTable };