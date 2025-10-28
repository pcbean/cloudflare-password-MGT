// 前端 API 客户端封装
const storage = {
  async get(key) {
    try {
      const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`);
      
      // 检查响应状态
      if (!res.ok) {
        console.error('API 响应错误:', res.status, res.statusText);
        const text = await res.text();
        console.error('响应内容:', text);
        return null;
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('响应不是 JSON 格式:', contentType);
        const text = await res.text();
        console.error('响应内容:', text);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      
      if (!res.ok) {
        console.error('API 响应错误:', res.status, res.statusText);
        const text = await res.text();
        console.error('响应内容:', text);
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
        method: 'DELETE'
      });
      
      if (!res.ok) {
        console.error('API 响应错误:', res.status, res.statusText);
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
      const res = await fetch(`/api/storage?action=list&prefix=${encodeURIComponent(prefix)}`);
      
      if (!res.ok) {
        console.error('API 响应错误:', res.status, res.statusText);
        return { keys: [] };
      }
      
      return await res.json();
    } catch (error) {
      console.error('列出数据失败:', error);
      return { keys: [] };
    }
  }
};