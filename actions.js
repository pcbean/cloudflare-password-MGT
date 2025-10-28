// 功能操作模块
const { useState } = React;

// 添加新密码
const addNewPassword = async (newPasswordData, categories, saveData, showNotification) => {
  const { categoryId, subcategoryId, website, url, username, password, note } = newPasswordData;

const updatedCategories = categories.map(cat => {
  if (cat.id === categoryId) {
    const newItem = {
      id: Date.now().toString(),
      website,
      url: url || `https://${website}`,
      favicon: getFaviconUrl(url || `https://${website}`),
      accounts: [{ username, password, note: note || '' }]
    };
    
    // 如果没有选择子分类,直接添加到大类下
    if (!subcategoryId) {
      // 确保 subcategories 数组存在
      const subcategories = cat.subcategories || [];
      // 查找或创建与大类同名的子分类
      let mainSub = subcategories.find(sub => sub.name === cat.name);
      
      if (!mainSub) {
        // 创建与大类同名的子分类并添加到最前面
        return {
          ...cat,
          subcategories: [
            {
              id: `${categoryId}-main`,
              name: cat.name,
              items: [newItem]
            },
            ...subcategories
          ]
        };
      } else {
        // 添加到已存在的大类子分类
        return {
          ...cat,
          subcategories: subcategories.map(sub => {
            if (sub.name === cat.name) {
              return {
                ...sub,
                items: [...(sub.items || []), newItem]
              };
            }
            return sub;
          })
        };
      }
    }
    
    // 如果选择了子分类,添加到指定子分类
    return {
      ...cat,
      subcategories: (cat.subcategories || []).map(sub => {
        if (sub.id === subcategoryId) {
          return {
            ...sub,
            items: [...(sub.items || []), newItem]
          };
        }
        return sub;
      })
    };
  }
  return cat;
});

  try {
    await saveData(updatedCategories);
    showNotification('密码已添加');
    return updatedCategories;
  } catch (error) {
    showNotification('添加失败', 'error');
    throw error;
  }
};

// 删除账户
const deleteAccount = async (itemId, accountIndex, categories, saveData, showNotification) => {
  if (!confirm('确定要删除这个账户吗?')) return null;

  const updatedCategories = categories.map(cat => ({
    ...cat,
    subcategories: cat.subcategories.map(sub => ({
      ...sub,
      items: sub.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            accounts: item.accounts.filter((_, idx) => idx !== accountIndex)
          };
        }
        return item;
      }).filter(item => item.accounts.length > 0)
    })).filter(sub => sub.items.length > 0)
  })).filter(cat => cat.subcategories.length > 0);

  try {
    await saveData(updatedCategories);
    showNotification('账户已删除');
    return updatedCategories;
  } catch (error) {
    showNotification('删除失败', 'error');
    return null;
  }
};

// 更新账户信息
const updateAccount = async (itemId, accountIndex, field, value, categories, saveData, showNotification) => {
  const updatedCategories = categories.map(cat => ({
    ...cat,
    subcategories: cat.subcategories.map(sub => ({
      ...sub,
      items: sub.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            accounts: item.accounts.map((acc, idx) => {
              if (idx === accountIndex) {
                return { ...acc, [field]: value };
              }
              return acc;
            })
          };
        }
        return item;
      })
    }))
  }));

  try {
    await saveData(updatedCategories);
    return updatedCategories;
  } catch (error) {
    showNotification('更新失败', 'error');
    throw error;
  }
};