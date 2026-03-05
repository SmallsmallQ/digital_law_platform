import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const PORT = 4310;
const workspaceRoot = process.cwd();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload));
}

function isSafePath(targetPath) {
  const resolved = path.resolve(workspaceRoot, targetPath);
  return resolved.startsWith(path.resolve(workspaceRoot));
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 200, {ok: true});
    return;
  }

  if (request.method !== 'POST' || request.url !== '/api/write-article') {
    sendJson(response, 404, {ok: false, error: 'Not Found'});
    return;
  }

  try {
    let body = '';
    for await (const chunk of request) {
      body += chunk;
    }

    const payload = JSON.parse(body || '{}');
    const outputPath = String(payload.outputPath || '');
    const content = String(payload.content || '');
    const overwrite = Boolean(payload.overwrite);

    if (!outputPath || !content) {
      sendJson(response, 400, {ok: false, error: 'outputPath 和 content 不能为空'});
      return;
    }

    if (!isSafePath(outputPath)) {
      sendJson(response, 400, {ok: false, error: '非法路径'});
      return;
    }

    const fullPath = path.resolve(workspaceRoot, outputPath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, {recursive: true});

    if (!overwrite) {
      try {
        await fs.access(fullPath);
        sendJson(response, 409, {ok: false, error: '文件已存在，请开启 overwrite'});
        return;
      } catch {
      }
    }

    await fs.writeFile(fullPath, content, 'utf8');
    sendJson(response, 200, {ok: true, path: outputPath});
  } catch (error) {
    sendJson(response, 500, {ok: false, error: error instanceof Error ? error.message : '未知错误'});
  }
});

server.listen(PORT, () => {
  console.log(`文章写入服务已启动: http://localhost:${PORT}`);
  console.log('接口: POST /api/write-article');
});
