#!/usr/bin/env node
process.env.ADW_GLOBAL = '1';
await import('./ticket.mjs');
