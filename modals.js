// 二级页面模态框组件
var { useState, useEffect } = React;

// 添加密码模态框
const AddPasswordModal = ({ 
  showModal, 
  setShowModal, 
  categories,
  selectedCategoryId,
  onAdd
}) => {
  const [formData, setFormData] = useState({
    categoryId: selectedCategoryId || '',
    subcategoryId: '',
    website: '',
    url: '',
    username: '',
    password: '',
    note: ''
  });

  // 检查是否是给现有项目添加账户
  const isAddingAccountMode = selectedCategoryId && categories
    .flatMap(c => c.subcategories.flatMap(s => s.items))
    .find(i => i.id === selectedCategoryId);

  useEffect(() => {
    if (selectedCategoryId) {
      setFormData(prev => ({ ...prev, categoryId: selectedCategoryId }));
    }
  }, [selectedCategoryId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 如果是添加账户模式,只需要验证用户名或密码
    if (isAddingAccountMode) {
      onAdd(formData);
      setFormData({
        categoryId: '',
        subcategoryId: '',
        website: '',
        url: '',
        username: '',
        password: '',
        note: ''
      });
      return;
    }
    
    // 否则是添加新密码项目,需要验证分类和网站
    if (!formData.categoryId || !formData.website) {
      alert('请填写分类和网站名称');
      return;
    }
    onAdd(formData);
    setFormData({
      categoryId: '',
      subcategoryId: '',
      website: '',
      url: '',
      username: '',
      password: '',
      note: ''
    });
  };

  if (!showModal) return null;

  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">
            {isAddingAccountMode
              ? `添加账户到 ${isAddingAccountMode.website}`
              : '添加新密码'}
          </h3>
          <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Icon name="X" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 只有在非添加账户模式下才显示分类选择器 */}
          {!isAddingAccountMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类 *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  required
                >
                  <option value="">选择分类</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">子分类</label>
                  <select
                    value={formData.subcategoryId}
                    onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  >
                    <option value="">默认</option>
                    {selectedCategory.subcategories
                      .filter(sub => sub.name !== '默认')
                      .map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站名称 *</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="例如: Google"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网址</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="用户名或邮箱(可选)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="密码(可选)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="可以在这里记录默认密码或其他信息"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 分类管理模态框
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
      setLocalCategories([...categories]);
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

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('确定要删除这个分类吗?所有子分类和密码项也会被删除!')) {
      setLocalCategories(localCategories.filter(cat => cat.id !== categoryId));
    }
  };

  const handleUpdateCategoryName = (categoryId, newName) => {
    setLocalCategories(localCategories.map(cat => 
      cat.id === categoryId ? { ...cat, name: newName } : cat
    ));
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
          subcategories: [...(cat.subcategories || []), newSub]
        };
      }
      return cat;
    }));
    setEditingSubcategory(`${categoryId}-${Date.now()}`);
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    if (window.confirm('确定要删除这个子分类吗?所有密码项也会被删除!')) {
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

  const handleUpdateSubcategoryName = (categoryId, subcategoryId, newName) => {
    setLocalCategories(localCategories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sub => 
            sub.id === subcategoryId ? { ...sub, name: newName } : sub
          )
        };
      }
      return cat;
    }));
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
          <button
            onClick={handleAddCategory}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center"
          >
            <Icon name="Plus" className="w-5 h-5 mr-2" />
            <span>添加大类</span>
          </button>

          {localCategories.map(category => (
            <div key={category.id} className="border-2 border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${category.icon && category.icon.startsWith('data:image') ? 'bg-white border-2 border-gray-200' : `bg-gradient-to-br ${category.color}`} rounded-lg flex items-center justify-center overflow-hidden shadow-sm`}>
  {category.icon && category.icon.startsWith('data:image') ? (
    <img src={category.icon} alt={category.name} className="w-full h-full object-contain" />
  ) : (
    <span className="text-xl">{category.icon || '🔑'}</span>
  )}
</div>
                {editingCategory === category.id ? (
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleUpdateCategoryName(category.id, e.target.value)}
                    onBlur={() => setEditingCategory(null)}
                    autoFocus
                    className="flex-1 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <span className="flex-1 font-semibold text-gray-800">{category.name}</span>
                )}

                <button
                  onClick={() => setEditingCategory(category.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="编辑分类名"
                >
                  <Icon name="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAddSubcategory(category.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="添加子分类"
                >
                  <Icon name="Plus" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="删除分类"
                >
                  <Icon name="Trash2" className="w-4 h-4" />
                </button>
              </div>

              {category.subcategories && category.subcategories.length > 0 && (
                <div className="ml-6 space-y-2 pl-4 border-l-2 border-gray-200">
                  {category.subcategories.map(sub => (
                    <div key={sub.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      {editingSubcategory === sub.id ? (
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleUpdateSubcategoryName(category.id, sub.id, e.target.value)}
                          onBlur={() => setEditingSubcategory(null)}
                          autoFocus
                          className="flex-1 px-3 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      ) : (
                        <span className="flex-1 text-sm text-gray-700">{sub.name} ({sub.items?.length || 0})</span>
                      )}
                      
                      <button
                        onClick={() => setEditingSubcategory(sub.id)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="编辑子分类"
                      >
                        <Icon name="Edit" className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="删除子分类"
                      >
                        <Icon name="Trash2" className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {localCategories.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <span className="text-4xl mb-4 block">📁</span>
              <p>还没有分类,点击上方按钮添加</p>
            </div>
          )}
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

// 图标选择器模态框
const IconSelectorModal = ({
  showModal, 
  setShowModal, 
  icons,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!showModal) {
      setSearchTerm('');
    }
  }, [showModal]);
  
  if (!showModal) return null;

  const filteredIcons = icons.filter(icon => 
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">选择图标</h3>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Icon name="X" className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Icon name="Search" className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索图标..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-sm"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {filteredIcons.map(icon => (
              <button
                key={icon.id}
                onClick={() => onSelect(icon.data)}
                className="border-2 border-gray-200 rounded-xl p-3 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={icon.data} alt={icon.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-xs text-gray-600 truncate mt-2" title={icon.name}>{icon.name}</div>
              </button>
            ))}
          </div>

                   {filteredIcons.length === 0 && icons.length > 0 && (
            <div className="text-center py-12 text-gray-400 col-span-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Icon name="Search" className="w-8 h-8 text-gray-300" />
              </div>
              <p>没有找到匹配的图标</p>
            </div>
          )}
          
          {icons.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Icon name="Image" className="w-8 h-8 text-gray-300" />
              </div>
              <p>还没有上传图标</p>
              <p className="text-sm mt-2">请先在图标管理中上传图标</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 图标管理模态框
const IconManagementModal = ({ 
  showModal, 
  setShowModal, 
  icons,
  onSave,
  showNotification
}) => {
 const [localIcons, setLocalIcons] = useState([]);
const [selectedIcons, setSelectedIcons] = useState([]);

useEffect(() => {
    if (showModal) {
      setLocalIcons([...icons]);
    }
  }, [showModal, icons]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newIcon = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          data: event.target.result
        };
        setLocalIcons(prev => [...prev, newIcon]);
      };
      reader.readAsDataURL(file);
    });
  };

const handleDelete = async (iconId) => {
  if (window.confirm('确定要删除这个图标吗?')) {
    const updatedIcons = localIcons.filter(icon => icon.id !== iconId);
    setLocalIcons(updatedIcons);
    await onSave(updatedIcons);
    showNotification('图标已删除');
  }
};

const handleBatchDelete = async () => {
  if (selectedIcons.length === 0) {
    alert('请先选择要删除的图标');
    return;
  }
  if (window.confirm(`确定要删除选中的 ${selectedIcons.length} 个图标吗?`)) {
    const updatedIcons = localIcons.filter(icon => !selectedIcons.includes(icon.id));
    setLocalIcons(updatedIcons);
    setSelectedIcons([]);
    await onSave(updatedIcons);
    showNotification('图标已删除');
  }
};
  const handleDownload = (icon) => {
    const link = document.createElement('a');
    link.href = icon.data;
    link.download = icon.name;
    link.click();
  };

  const handleSave = async () => {
    await onSave(localIcons);
    setShowModal(false);
    showNotification('图标已保存');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">图标管理</h3>
          <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Icon name="X" className="w-6 h-6" />
          </button>
        </div>

                <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <label className="flex-1 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
              <Icon name="Plus" className="w-5 h-5 mr-2" />
              <span>上传图标</span>
            </label>
            
            {selectedIcons.length > 0 && (
              <button
                onClick={handleBatchDelete}
                className="px-6 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition flex items-center justify-center"
              >
                <Icon name="Trash2" className="w-5 h-5 mr-2" />
                <span>删除选中 ({selectedIcons.length})</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
  {localIcons.map(icon => (
  <div key={icon.id} className={`border-2 ${selectedIcons.includes(icon.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-xl p-3 space-y-2 relative`}>
    <input
      type="checkbox"
      checked={selectedIcons.includes(icon.id)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedIcons([...selectedIcons, icon.id]);
        } else {
          setSelectedIcons(selectedIcons.filter(id => id !== icon.id));
        }
      }}
      className="absolute top-2 right-2 w-5 h-5 cursor-pointer"
    />
                <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={icon.data} alt={icon.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-xs text-gray-600 truncate" title={icon.name}>{icon.name}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(icon)}
                    className="flex-1 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                  >
                    下载
                  </button>
                  <button
                    onClick={() => handleDelete(icon.id)}
                    className="flex-1 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>

          {localIcons.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Icon name="Image" className="w-8 h-8 text-gray-300" />
              </div>
              <p>还没有上传图标</p>
            </div>
          )}
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

// 编辑项目模态框
const EditItemModal = ({ 
  showModal, 
  setShowModal, 
  itemToEdit,
  categories,
  onSave
}) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    subcategoryId: '',
    website: '',
    url: '',
    accounts: []
  });

  useEffect(() => {
    if (itemToEdit) {
      // 查找当前项目所在的分类和子分类
      let foundCategoryId = '';
      let foundSubcategoryId = '';
      
      categories.forEach(cat => {
        cat.subcategories?.forEach(sub => {
          const found = sub.items?.find(item => item.id === itemToEdit.id);
          if (found) {
            foundCategoryId = cat.id;
            foundSubcategoryId = sub.id;
          }
        });
      });

      setFormData({
        categoryId: foundCategoryId,
        subcategoryId: foundSubcategoryId,
        website: itemToEdit.website || '',
        url: itemToEdit.url || '',
        accounts: itemToEdit.accounts || []
      });
    }
  }, [itemToEdit, categories]);

  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = formData.accounts.map((acc, idx) => 
      idx === index ? { ...acc, [field]: value } : acc
    );
    setFormData({ ...formData, accounts: updatedAccounts });
  };

  const handleAddAccount = () => {
    setFormData({
      ...formData,
      accounts: [...formData.accounts, { username: '', password: '', note: '' }]
    });
  };

  const handleRemoveAccount = (index) => {
    if (formData.accounts.length <= 1) {
      alert('至少需要保留一个账户');
      return;
    }
    const updatedAccounts = formData.accounts.filter((_, idx) => idx !== index);
    setFormData({ ...formData, accounts: updatedAccounts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.website) {
      alert('请填写网站名称');
      return;
    }
    if (!formData.categoryId) {
      alert('请选择分类');
      return;
    }
    onSave(formData);
  };

  if (!showModal) return null;

  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">编辑项目</h3>
          <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Icon name="X" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分类 *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              required
            >
              <option value="">选择分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">子分类</label>
              <select
                value={formData.subcategoryId}
                onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="">默认</option>
                {selectedCategory.subcategories
                  .filter(sub => sub.name !== '默认')
                  .map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">网站名称 *</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="例如: Google"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">网址</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">账户信息</label>
              <button
                type="button"
                onClick={handleAddAccount}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 添加账户
              </button>
            </div>
            
            {formData.accounts.map((account, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">账户 {index + 1}</span>
                  {formData.accounts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAccount(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      删除
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">用户名</label>
                  <input
                    type="text"
                    value={account.username}
                    onChange={(e) => handleAccountChange(index, 'username', e.target.value)}
                    placeholder="用户名或邮箱"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">密码</label>
                  <input
                    type="text"
                    value={account.password}
                    onChange={(e) => handleAccountChange(index, 'password', e.target.value)}
                    placeholder="密码"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">备注</label>
                  <textarea
                    value={account.note || ''}
                    onChange={(e) => handleAccountChange(index, 'note', e.target.value)}
                    placeholder="备注信息"
                    rows="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};