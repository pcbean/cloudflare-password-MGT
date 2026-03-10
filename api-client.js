// 前端 API 客户端封装
const storage = {
  getHeaders() {
    const token = localStorage.getItem('auth_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async get(key) {
    try {
      const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, {
        headers: this.getHeaders()
      });

      // 检查响应状态
      if (!res.ok) {
        console.error('API 响应错误:', res.status, res.statusText);
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_username');
          window.location.reload();
        }
        return null;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('响应不是 JSON 格式:', contentType);
        return null;
      }

      const data = await res.json();
      return data.value ? { key, value: data.value } : null;
    } catch (error) {
      console.error('获取数据失败:', error);
      return null;
    }
  },

  async set(key, value) {
    try {
      const res = await fetch('/api/storage', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ key, value })
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_username');
          window.location.reload();
        }
        throw new Error(`保存失败: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error('保存数据失败:', error);
      throw error;
    }
  },

  async delete(key) {
    try {
      const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_username');
          window.location.reload();
        }
        throw new Error(`删除失败: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error('删除数据失败:', error);
      throw error;
    }
  },

  async list(prefix = '') {
    try {
      const res = await fetch(`/api/storage?action=list&prefix=${encodeURIComponent(prefix)}`, {
        headers: this.getHeaders()
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_username');
          window.location.reload();
        }
        return { keys: [] };
      }

      return await res.json();
    } catch (error) {
      console.error('列出数据失败:', error);
      return { keys: [] };
    }
  }
};