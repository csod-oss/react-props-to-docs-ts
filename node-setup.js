#!/usr/bin/env node
const noop = () => undefined;
require.extensions['.css'] = noop;