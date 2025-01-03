#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Inspect CLI v1.0.0.

	By default the CLI will list all attached devices on: http://localhost:9222

	To view the DevTools UI, either use the above links (which use the "frontend" URL noted below) or use Chrome's built-in inspector, e.g.:
  	chrome-devtools://devtools/bundled/inspector.html?ws=localhost:9221/devtools/page/1

	Usage
	  $ inspect-cli

	Options
		--port     Target listening port
		--debug    Enable debug output.
		--help     Print this usage information.
		--version  Print version information and exit.

	Examples
	  $ inspect-cli --port=9222
`,
	{
		importMeta: import.meta,
		flags: {
			port: {
				type: 'number',
			},
			debug: {
				type: 'boolean',
			},		
			help: {
				type: 'boolean',
			},	
			version: {
				type: 'boolean',
			},								
		},
	},
);

render(<App port={cli.flags.port} />);
