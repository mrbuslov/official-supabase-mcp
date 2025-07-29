import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Функция для запуска Supabase MCP сервера
function startSupabaseMCP() {
  console.log('Starting Supabase MCP Server...');
  
  // Проверяем наличие необходимых переменных окружения
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const projectRef = process.env.SUPABASE_PROJECT_REF;
  const readOnly = process.env.SUPABASE_READ_ONLY === 'true';
  
  if (!accessToken) {
    console.error('ERROR: SUPABASE_ACCESS_TOKEN environment variable is required');
    process.exit(1);
  }
  
  // Строим команду для запуска
  const args = [
    'run',
    '@supabase/mcp-server-supabase@latest',
    '--access-token',
    accessToken
  ];
  
  // Добавляем опциональные параметры
  if (projectRef) {
    args.push('--project-ref', projectRef);
  }
  
  if (readOnly) {
    args.push('--read-only');
  }
  
  // Запускаем дочерний процесс
  const child = spawn('npx', args, {
    stdio: 'inherit',
    env: process.env
  });
  
  child.on('error', (error) => {
    console.error('Failed to start Supabase MCP server:', error);
    process.exit(1);
  });
  
  child.on('close', (code) => {
    console.log(`Supabase MCP server exited with code ${code}`);
    if (code !== 0) {
      process.exit(code);
    }
  });
  
  // Обработка сигналов для корректного завершения
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, stopping Supabase MCP server...');
    child.kill('SIGTERM');
  });
  
  process.on('SIGINT', () => {
    console.log('Received SIGINT, stopping Supabase MCP server...');
    child.kill('SIGINT');
  });
}

// Запускаем сервер
startSupabaseMCP();
