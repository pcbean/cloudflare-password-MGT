// /functions/api/storage.js
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

// 提取验证授权的公共方法
async function verifyAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  if (!env.PASSWORD_KV) return false;

  const username = await env.PASSWORD_KV.get(`session_${token}`);
  return !!username; // 如果存在该 token 对应的用户则视为有效
}

// GET 请求
export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const isAuthorized = await verifyAuth(request, env);
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: '未授权访问' }), { status: 401, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (!env.PASSWORD_KV) {
      return new Response(
        JSON.stringify({ error: 'KV namespace not bound' }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (action === 'list') {
      const prefix = url.searchParams.get('prefix') || '';
      const list = await env.PASSWORD_KV.list({ prefix });
      return new Response(
        JSON.stringify({ keys: list.keys.map(k => k.name).filter(k => !k.startsWith('session_')) }),
        { status: 200, headers: corsHeaders }
      );
    }

    const key = url.searchParams.get('key');
    if (!key) {
      return new Response(
        JSON.stringify({ error: 'Key parameter is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const value = await env.PASSWORD_KV.get(key);
    return new Response(
      JSON.stringify({ key, value }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST 请求
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const isAuthorized = await verifyAuth(request, env);
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: '未授权访问' }), { status: 401, headers: corsHeaders });
    }

    if (!env.PASSWORD_KV) {
      return new Response(
        JSON.stringify({ error: 'KV namespace not bound' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return new Response(
        JSON.stringify({ error: 'Key and value are required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    await env.PASSWORD_KV.put(key, value);
    return new Response(
      JSON.stringify({ success: true, key }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE 请求
export async function onRequestDelete(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  try {
    const isAuthorized = await verifyAuth(request, env);
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: '未授权访问' }), { status: 401, headers: corsHeaders });
    }

    if (!env.PASSWORD_KV) {
      return new Response(
        JSON.stringify({ error: 'KV namespace not bound' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const key = url.searchParams.get('key');
    if (!key) {
      return new Response(
        JSON.stringify({ error: 'Key parameter is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    await env.PASSWORD_KV.delete(key);
    return new Response(
      JSON.stringify({ success: true, key }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}