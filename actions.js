// 功能操作模块
const { useState } = React;

// 添加新密码
const addNewPassword = async (newPasswordData, categories, saveData, showNotification) => {
  const { categoryId, subcategoryId, website, url, username, password, note } = newPasswordData;

  const updatedCategories = categories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.id === subcategoryId) {
            const newItem = {
              id: Date.now().toString(),
              website,
              url,
              favicon: getFaviconUrl(url),
              accounts: [{ username, password, note: note || '' }]
            };
            return {
              ...sub,
              items: [...sub.items, newItem]
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