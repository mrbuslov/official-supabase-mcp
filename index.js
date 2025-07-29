import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSupabaseMCPServer } from '@supabase/mcp-server-supabase';

const server = new Server(
  {
    name: 'supabase-mcp-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {}
    }
  }
);

// Настройка Supabase MCP сервера
await createSupabaseMCPServer(server, {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
});

// Запуск сервера
const transport = new StdioServerTransport();
await server.connect(transport);
