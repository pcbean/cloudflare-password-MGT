// /functions/api/storage.js
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, { 
    status: 200,
    headers: corsHeaders 
  });
}

// GET 请求
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  try {
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
        JSON.stringify({ keys: list.keys.map(k => k.name) }),
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
