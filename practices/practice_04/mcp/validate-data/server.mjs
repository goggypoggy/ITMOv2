#!/usr/bin/env node
// Minimal MCP-like JSON-RPC server over stdio with a single tool: validateDataSchemas
import { validate } from '../../scripts/validate-data.mjs';

const tools = [
  {
    name: 'validateDataSchemas',
    description: 'Validate src/data/* schemas and return diagnostics.',
    inputSchema: {
      type: 'object',
      properties: { simulateError: { type: 'boolean' } },
      additionalProperties: false,
    },
  },
];

function send(id, result){
  const msg = { jsonrpc: '2.0', id, result };
  process.stdout.write(JSON.stringify(msg) + '\n');
}
function sendError(id, code, message){
  const msg = { jsonrpc: '2.0', id, error: { code, message } };
  process.stdout.write(JSON.stringify(msg) + '\n');
}

let initialized = false;

process.stdin.setEncoding('utf8');
let buf = '';
process.stdin.on('data', async (chunk) => {
  buf += chunk;
  let idx;
  while ((idx = buf.indexOf('\n')) >= 0){
    const line = buf.slice(0, idx);
    buf = buf.slice(idx + 1);
    if (!line.trim()) continue;
    let req;
    try { req = JSON.parse(line); } catch { continue; }
    const { id, method, params } = req;
    try {
      if (method === 'initialize'){
        initialized = true;
        return send(id, { capabilities: { tools: {} } });
      }
      if (!initialized) return sendError(id, -32000, 'Not initialized');
      if (method === 'tools/list'){
        return send(id, { tools });
      }
      if (method === 'tools/call'){
        if (!params || params.name !== 'validateDataSchemas'){
          return sendError(id, -32602, 'Unknown tool');
        }
        const simulateError = !!(params.arguments && params.arguments.simulateError);
        const res = await validate({ simulateError });
        if (res.ok){
          return send(id, { content: [{ type: 'text', text: res.messages.join('\n') }] });
        }
        return send(id, { content: [{ type: 'text', text: res.errors.join('\n') }], isError: true });
      }
      // Default: method not found
      return sendError(id, -32601, 'Method not found');
    } catch (e){
      return sendError(id, -32001, (e && e.message) || 'Internal error');
    }
  }
});

process.stdin.on('end', () => process.exit(0));
