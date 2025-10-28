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
              <span className="text-4xl mb-4 block">🖼️</span>
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

// 图标选择器模态框
const IconSelectorModal = ({ 
  showModal, 
  setShowModal, 
  icons,
  onSelect
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">选择图标</h3>
          <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Icon name="X" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {icons.map(icon => (
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

          {icons.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <span className="text-4xl mb-4 block">🖼️</span>
              <p>还没有上传图标</p>
              <p className="text-sm mt-2">请先在图标管理中上传图标</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};