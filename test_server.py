import http.server
import socketserver
import json
import urllib.parse
import os
import secrets
import string

PORT = 8000
DIRECTORY = r"z:\D\Soft\翻墙\3-Cloudflare\02-部署相关\01-密码管理器\1.6 修复bug"

# 模拟环境变量
env = {
    'username1': 'admin',
    'password1': 'admin123'
}

# 模拟 KV 数据库
kv_store = {}

def get_auth_username(headers):
    auth_header = headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header[7:]
    
    # 查找 token 对应的用户
    for key, value in kv_store.items():
        if key == f"session_{token}":
            return value
    return None

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_json_response(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        # 拦截 /api/login
        if parsed_url.path == '/api/login':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data)
                username = body.get('username')
                password = body.get('password')
                
                print(f"Login attempt: {username}/{password}")
                
                is_valid = False
                for i in range(1, 10):
                    u = env.get(f"username{i}")
                    p = env.get(f"password{i}")
                    if u and p and u == username and p == password:
                        is_valid = True
                        break
                
                if is_valid:
                    # 生成随机 token
                    token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
                    kv_store[f"session_{token}"] = username
                    self.send_json_response(200, {"success": True, "token": token, "username": username})
                else:
                    self.send_json_response(401, {"error": "用户名或密码错误"})
            except Exception as e:
                self.send_json_response(500, {"error": str(e)})
            return
            
        # 拦截 /api/storage POST
        if parsed_url.path == '/api/storage':
            username = get_auth_username(self.headers)
            if not username:
                self.send_json_response(401, {"error": "未授权访问"})
                return
                
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data)
                key = body.get('key')
                value = body.get('value')
                
                if not key:
                    self.send_json_response(400, {"error": "Key is required"})
                    return
                    
                kv_store[key] = value
                self.send_json_response(200, {"success": True, "key": key})
            except Exception as e:
                self.send_json_response(500, {"error": str(e)})
            return

        super().do_POST()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed_url.query)
        
        # 拦截 /api/storage GET
        if parsed_url.path == '/api/storage':
            username = get_auth_username(self.headers)
            if not username:
                self.send_json_response(401, {"error": "未授权访问"})
                return
                
            action = query.get('action', [None])[0]
            
            if action == 'list':
                prefix = query.get('prefix', [''])[0]
                keys = [k for k in kv_store.keys() if k.startswith(prefix) and not k.startswith("session_")]
                self.send_json_response(200, {"keys": keys})
                return
                
            key = query.get('key', [None])[0]
            if not key:
                self.send_json_response(400, {"error": "Key is required"})
                return
                
            value = kv_store.get(key)
            self.send_json_response(200, {"key": key, "value": value})
            return
            
        super().do_GET()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Server running at http://localhost:" + str(PORT))
    httpd.serve_forever()
