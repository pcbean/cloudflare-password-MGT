// /functions/api/login.js
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return new Response(JSON.stringify({ error: '请提供用户名和密码' }), { status: 400, headers: corsHeaders });
    }

    let isValidUser = false;
    let i = 1;

    // 验证用户在环境变量中是否存在
    while (true) {
      const u = env[`username${i}`];
      const p = env[`password${i}`];
      
      if (!u || !p) break;
      
      if (u === username && p === password) {
        isValidUser = true;
        break;
      }
      i++;
    }

    if (!isValidUser) {
      return new Response(JSON.stringify({ error: '用户名或密码错误' }), { status: 401, headers: corsHeaders });
    }

    if (!env.PASSWORD_KV) {
      return new Response(JSON.stringify({ error: '未绑定 KV 存储空间' }), { status: 500, headers: corsHeaders });
    }

    // 生成随机登录令牌 (Token)
    const token = crypto.randomUUID();
    
    // 将 Token 与用户名绑定, 存入 KV 数据库中, 有效期为 24 小时 (86400秒)
    await env.PASSWORD_KV.put(`session_${token}`, username, { expirationTtl: 86400 });

    return new Response(JSON.stringify({ success: true, token, username }), { status: 200, headers: corsHeaders });
    
  } catch (error) {
    console.error('Login Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}
