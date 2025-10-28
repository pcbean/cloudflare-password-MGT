// functions/api/get-env-users.js
export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { env } = context;
    const users = {};
    let i = 1;
    
    // 添加调试日志
    console.log('开始读取环境变量');
    
    // 循环读取环境变量
    while (true) {
      const usernameKey = `username${i}`;
      const passwordKey = `password${i}`;
      
      const username = env[usernameKey];
      const password = env[passwordKey];
      
      // 如果用户名或密码为空,停止循环
      if (!username || !password) {
        console.log(`在 ${i} 处停止读取`);
        break;
      }
      
      users[username] = password;
      console.log(`找到用户: ${usernameKey} = ${username}`);
      i++;
    }
    
    console.log(`共找到 ${Object.keys(users).length} 个用户`);
    
    return new Response(
      JSON.stringify({ users }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('读取环境变量错误:', error);
    // 即使出错也返回 200 状态码和空对象
    return new Response(
      JSON.stringify({ 
        users: {},
        error: error.message 
      }),
      { status: 200, headers: corsHeaders }
    );
  }
}