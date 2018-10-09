import React from 'react';
import ReactDOM from 'react-dom';
import { PropsTable } from './build/PropsTable';

const docs = {
  'foo': {
    typeText: 'number',
    required: true,
    defaultValue: 42,
    description: 'use this prop to set the foo prop value on the component'
  },
  'bar': {
    typeText: 'string',
    required: false,
    description: 'use this prop to set the bar prop value on the component',
    defaultValue: 'barbarbar'
  },
  'baz': {
    typeText: 'Function',
    required: false,
    description: 'use this prop to set the baz prop value on the component (no default)'
  }
};

const App = () => (
  <PropsTable docs={docs} component={{}} />
);

ReactDOM.render(<App />, document.getElementById('root'));
