// 工具函数集合

// 密码强度检测
const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: 'bg-gray-300' };
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { strength, label: '弱', color: 'bg-red-500' };
  if (strength <= 3) return { strength, label: '中', color: 'bg-yellow-500' };
  return { strength, label: '强', color: 'bg-green-500' };
};

// 计算总体密码安全状态
const calculateOverallSecurity = (categories) => {
  let totalPasswords = 0;
  let strongCount = 0;
  let weakCount = 0;
  let mediumCount = 0;

  categories.forEach(category => {
    category.subcategories?.forEach(subcategory => {
      subcategory.items?.forEach(item => {
        item.accounts?.forEach(account => {
          totalPasswords++;
          const strength = getPasswordStrength(account.password);
          if (strength.label === '强') strongCount++;
          else if (strength.label === '中') mediumCount++;
          else if (strength.label === '弱') weakCount++;
        });
      });
    });
  });

  return {
    total: totalPasswords,
    strong: strongCount,
    medium: mediumCount,
    weak: weakCount,
    strongPercent: totalPasswords > 0 ? Math.round((strongCount / totalPasswords) * 100) : 0,
    mediumPercent: totalPasswords > 0 ? Math.round((mediumCount / totalPasswords) * 100) : 0,
    weakPercent: totalPasswords > 0 ? Math.round((weakCount / totalPasswords) * 100) : 0
  };
};

// 获取网站图标 (现已废弃默认地球图标，改从 ui.js 取首字母大写)
const getFaviconUrl = (websiteUrl) => {
  return null;
};

// 复制到剪贴板
const copyToClipboard = (text, type, showNotification) => {
  navigator.clipboard.writeText(text);
  showNotification(`${type}已复制`);
};

// 导出为 CSV
const exportToCSV = (categories, currentUser, showNotification) => {
  let csvContent = "\ufeff分类,子分类,网站,网址,用户名,密码,备注\n";

  categories.forEach(category => {
    category.subcategories?.forEach(subcategory => {
      subcategory.items?.forEach(item => {
        item.accounts?.forEach(account => {
          csvContent += `"${category.name}","${subcategory.name}","${item.website}","${item.url}","${account.username}","${account.password}","${account.note || ''}"\n`;
        });
      });
    });
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `passwords_${currentUser}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  showNotification('导出成功');
};

// 搜索过滤
const filterItems = (categories, searchTerm) => {
  if (!searchTerm) return categories;

  return categories.map(category => ({
    ...category,
    subcategories: category.subcategories.map(sub => ({
      ...sub,
      items: sub.items.filter(item =>
        item.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accounts.some(acc => acc.username.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(sub => sub.items.length > 0)
  })).filter(category => category.subcategories.length > 0);
};

// 添加新项目
const addNewItem = async (newItem, categories, saveData, showNotification) => {
  // 移除必填校验,允许空值
  if (!newItem.category && categories.length === 0) {
    showNotification('至少需要一个分类', 'error');
    return null;
  }

  const updatedCategories = [...categories];
  let categoryIndex = updatedCategories.findIndex(c => c.name === newItem.category);

  if (categoryIndex === -1) {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ];
    updatedCategories.push({
      id: Date.now().toString(),
      name: newItem.category,
      icon: '🔑',
      color: colors[Math.floor(Math.random() * colors.length)],
      subcategories: []
    });
    categoryIndex = updatedCategories.length - 1;
  }

  let subcategoryIndex = updatedCategories[categoryIndex].subcategories.findIndex(
    s => s.name === (newItem.subcategory || '默认')
  );

  if (subcategoryIndex === -1) {
    updatedCategories[categoryIndex].subcategories.push({
      id: `${updatedCategories[categoryIndex].id}-${Date.now()}`,
      name: newItem.subcategory || '默认',
      items: []
    });
    subcategoryIndex = updatedCategories[categoryIndex].subcategories.length - 1;
  }

  const finalUrl = newItem.url || (newItem.website.startsWith('http') ? newItem.website : `https://${newItem.website}`);

  updatedCategories[categoryIndex].subcategories[subcategoryIndex].items.push({
    id: Date.now().toString(),
    website: newItem.website,
    url: finalUrl,
    favicon: getFaviconUrl(finalUrl),
    accounts: newItem.accounts.filter(a => a.username && a.password)
  });

  await saveData(updatedCategories);
  showNotification('密码已添加');
  return updatedCategories;
};

// 删除项目
const deleteItem = async (categoryId, subcategoryId, itemId, categories, saveData, showNotification) => {
  if (!confirm('确定要删除这个项目吗?')) return null;

  const updatedCategories = categories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.id === subcategoryId) {
            return {
              ...sub,
              items: sub.items.filter(item => item.id !== itemId)
            };
          }
          return sub;
        }).filter(sub => sub.items.length > 0)
      };
    }
    return cat;
  }).filter(cat => cat.subcategories.length > 0);

  await saveData(updatedCategories);
  showNotification('项目已删除');
  return updatedCategories;
};

// 暴露到全局
window.getPasswordStrength = getPasswordStrength;
window.calculateOverallSecurity = calculateOverallSecurity;
window.getFaviconUrl = getFaviconUrl;
window.copyToClipboard = copyToClipboard;
window.exportToCSV = exportToCSV;
window.filterItems = filterItems;