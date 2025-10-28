// 二级页面模态框组件
const { useState, useEffect } = React;

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

  useEffect(() => {
    if (selectedCategoryId) {
      setFormData(prev => ({ ...prev, categoryId: selectedCategoryId }));
    }
  }, [selectedCategoryId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.website || !formData.username || !formData.password) {
      alert('请填写必填字段');
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
          <h3 className="text-2xl font-bold text-gray-800">添加新密码</h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名 *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="用户名或邮箱"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码 *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="密码"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="可选备注信息"
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

        <div className="p-6">
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl mb-4 block">📁</span>
            <p>分类管理功能开发中...</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            关闭
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

  const handleDelete = (iconId) => {
    if (window.confirm('确定要删除这个图标吗?')) {
      setLocalIcons(localIcons.filter(icon => icon.id !== iconId));
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
          <div>
            <label className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center cursor-pointer">
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
          </div>

          <div className="grid grid-cols-4 gap-4">
            {localIcons.map(icon => (
              <div key={icon.id} className="border border-gray-200 rounded-xl p-3 space-y-2">
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