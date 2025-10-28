// 二级页面模态框组件
const { useState, useEffect } = React;

// 分类管理模态框
const CategoryManagementModal = ({ 
  showModal, 
  setShowModal, 
  categories,
  onSave,
  showNotification
}) => {
  const [localCategories, setLocalCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  useEffect(() => {
    if (showModal) {
      setLocalCategories(JSON.parse(JSON.stringify(categories)));
    }
  }, [showModal, categories]);

  const handleAddCategory = () => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ];
    const newCategory = {
      id: Date.now().toString(),
      name: '新分类',
      icon: '🔑',
      color: colors[Math.floor(Math.random() * colors.length)],
      subcategories: []
    };
    setLocalCategories([...localCategories, newCategory]);
    setEditingCategory(newCategory.id);
  };

  const handleUpdateCategory = (categoryId, field, value) => {
    setLocalCategories(localCategories.map(cat =>
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ));
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('确定要删除这个分类吗?')) {
      setLocalCategories(localCategories.filter(cat => cat.id !== categoryId));
    }
  };

  const handleAddSubcategory = (categoryId) => {
    setLocalCategories(localCategories.map(cat => {
      if (cat.id === categoryId) {
        const newSub = {
          id: `${categoryId}-${Date.now()}`,
          name: '新子分类',
          items: []
        };
        return {
          ...cat,
          subcategories: [...cat.subcategories, newSub]
        };
      }
      return cat;
    }));
  };

  const handleUpdateSubcategory = (categoryId, subcategoryId, value) => {
    setLocalCategories(localCategories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sub =>
            sub.id === subcategoryId ? { ...sub, name: value } : sub
          )
        };
      }
      return cat;
    }));
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    if (window.confirm('确定要删除这个子分类吗?')) {
      setLocalCategories(localCategories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
          };
        }
        return cat;
      }));
    }
  };

  const handleSave = async () => {
    await onSave(localCategories);
    setShowModal(false);
    showNotification('分类已保存');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">分类管理</h3>
          <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Icon name="X" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {localCategories.map(category => (
            <div key={category.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={category.icon}
                  onChange={(e) => handleUpdateCategory(category.id, 'icon', e.target.value)}
                  className="w-16 text-center text-2xl px-2 py-1 border border-gray-300 rounded-lg"
                  placeholder="🔑"
                />
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleUpdateCategory(category.id, 'name', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="分类名称"
                />
                <button
                  onClick={() => handleAddSubcategory(category.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="添加子分类"
                >
                  <Icon name="Plus" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="删除分类"
                >
                  <Icon name="Trash2" className="w-5 h-5" />
                </button>
              </div>

              {category.subcategories?.length > 0 && (
                <div className="ml-8 space-y-2">
                  {category.subcategories.map(sub => (
                    <div key={sub.id} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => handleUpdateSubcategory(category.id, sub.id, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="子分类名称"
                      />
                      <button
                        onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="删除子分类"
                      >
                        <Icon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={handleAddCategory}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-orange-500 hover:text-orange-600 transition"
          >
            + 添加新分类
          </button>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

// 新增密码模态框
const AddPasswordModal = ({ 
  showModal, 
  setShowModal, 
  categories,
  selectedCategoryId,
  onAdd
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [website, setWebsite] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (showModal && selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
    }
  }, [showModal, selectedCategoryId]);

const handleSubmit = () => {
  // 只验证必填项：分类、网站名称、用户名、密码
  if (!selectedCategory || !website || !username || !password) {
    alert('请填写所有必填项');
    return;
  }
  onAdd({
  categoryId: selectedCategory,
  subcategoryId: selectedSubcategory || '', // 确保传递空字符串而不是 undefined
  website,
  url: url || `https://${website}`,
  username,
  password,
  note
});

    // 重置表单
    setSelectedCategory('');
    setSelectedSubcategory('');
    setWebsite('');
    setUrl('');
    setUsername('');
    setPassword('');
    setNote('');
  };

  if (!showModal) return null;

  const category = categories.find(c => c.id === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">新增密码</h3>
          <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Icon name="X" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">选择分类 *</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('');
              }}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            >
              <option value="">请选择分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

{selectedCategory && (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">选择子分类 (选填)</label>
    <select
      value={selectedSubcategory}
      onChange={(e) => setSelectedSubcategory(e.target.value)}
      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
    >
      <option value="">大类(无子分类)</option>
      {category?.subcategories?.map(sub => (
        <option key={sub.id} value={sub.id}>{sub.name}</option>
      ))}
    </select>
  </div>
)}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">网站名称 *</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="例如: Docker Hub"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">网址 (选填)</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="例如: https://hub.docker.com"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">用户名 *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入用户名"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">密码 *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">备注 (选填)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注信息"
              rows="3"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition"
          >
            添加密码
          </button>
        </div>
      </div>
    </div>
  );
};