// 主界面 UI 组件
const { useState, useEffect } = React;

// 通知组件
const Notification = ({ notification }) => {
  if (!notification) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 ${
      notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white animate-slide-in`}>
      <Icon name={notification.type === 'success' ? 'Check' : 'AlertCircle'} />
      <span>{notification.message}</span>
    </div>
  );
};

// 侧边栏组件
const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  isMobile, 
  totalPasswords, 
  searchTerm, 
  setSearchTerm,
  filteredCategories,
  expandedCategories,
  toggleCategory,
  selectedItem,
  setSelectedItem,
  setShowCategoryModal,
  onExport,
  onAddPassword,
  onIconManagement,
  onSelectIcon,
  onReorderCategories,
  onReorderSubcategories,
  onReorderItems
}) => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedItem: null,
    draggedIndex: null,
    dragType: null,
    categoryId: null,
    subcategoryId: null,
    startY: 0,
    currentY: 0,
    overIndex: null
  });

  if (!sidebarOpen) return null;

  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMove = (e) => {
      e.preventDefault();
      const clientY = e.type === 'mousemove' ? e.clientY : e.touches?.[0]?.clientY;
      if (clientY) {
        setDragState(prev => ({
          ...prev,
          currentY: clientY
        }));
      }
    };

    const handleEnd = () => {
      if (dragState.isDragging && dragState.overIndex !== null && dragState.draggedIndex !== dragState.overIndex) {
        const { dragType, draggedIndex, overIndex, categoryId, subcategoryId } = dragState;
        
        if (dragType === 'category') {
          onReorderCategories(draggedIndex, overIndex);
        } else if (dragType === 'subcategory' && categoryId) {
          onReorderSubcategories(categoryId, draggedIndex, overIndex);
        } else if (dragType === 'item' && categoryId && subcategoryId) {
          onReorderItems(categoryId, subcategoryId, draggedIndex, overIndex);
        }
      }

      setDragState({
        isDragging: false,
        draggedItem: null,
        draggedIndex: null,
        dragType: null,
        categoryId: null,
        subcategoryId: null,
        startY: 0,
        currentY: 0,
        overIndex: null
      });
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragState.isDragging, dragState.overIndex, dragState.draggedIndex, dragState.categoryId, dragState.subcategoryId, onReorderCategories, onReorderSubcategories, onReorderItems]);

  const handleDragStart = (e, type, item, index, categoryId = null, subcategoryId = null) => {
    e.stopPropagation();
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    setDragState({
      isDragging: true,
      draggedItem: item,
      draggedIndex: index,
      dragType: type,
      categoryId,
      subcategoryId,
      startY: clientY,
      currentY: clientY,
      overIndex: index
    });
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragState.isDragging && dragState.overIndex !== index) {
      setDragState(prev => ({
        ...prev,
        overIndex: index
      }));
    }
  };

  return (
    <div className={`${sidebarOpen ? (isMobile ? 'w-full' : 'w-80') : 'w-0'} ${
      isMobile ? 'fixed z-40 h-full' : 'relative'
    } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col shadow-sm`}>
      
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Icon name="Key" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">所有密钥</h2>
              <p className="text-sm text-gray-500">{totalPasswords} 项</p>
            </div>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Icon name="X" />
            </button>
          )}
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon name="Search" className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredCategories.map((category, categoryIndex) => (
          <div key={category.id} className="space-y-1">
            <div 
              className="w-full flex items-center gap-2"
              onMouseEnter={(e) => dragState.isDragging && dragState.dragType === 'category' && handleDragOver(e, categoryIndex)}
              style={{
                backgroundColor: dragState.isDragging && dragState.dragType === 'category' && dragState.overIndex === categoryIndex ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                borderRadius: '0.75rem',
                transition: 'background-color 0.2s'
              }}
            >
              <button
                onMouseDown={(e) => handleDragStart(e, 'category', category, categoryIndex)}
                onTouchStart={(e) => handleDragStart(e, 'category', category, categoryIndex)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing"
                title="拖动排序"
                style={{
                  opacity: dragState.isDragging && dragState.dragType === 'category' && dragState.draggedIndex === categoryIndex ? 0.5 : 1
                }}
              >
                <Icon name="GripVertical" className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex-1 flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.icon && typeof category.icon === 'string' && category.icon.startsWith('data:image') && category.icon.length > 20 ? 'bg-white border-2 border-gray-200' : `bg-gradient-to-br ${category.color}`} rounded-lg flex items-center justify-center overflow-hidden shadow-sm`}>
                    {category.icon && typeof category.icon === 'string' && category.icon.startsWith('data:image') && category.icon.length > 20 ? (
                      <img src={category.icon} alt={category.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">{category.icon || '🔑'}</span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">{category.name}</span>
                </div>
                <Icon name={expandedCategories[category.id] ? 'ChevronDown' : 'ChevronRight'} className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => onSelectIcon('category', category.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="更换图标"
              >
                <Icon name="Image" className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAddPassword(category.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="新增密码"
              >
                <Icon name="Plus" className="w-4 h-4" />
              </button>
            </div>
            
            {expandedCategories[category.id] && (
              <>
                {category.subcategories?.find(sub => sub.name === '默认')?.items?.map((item, itemIndex) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-2"
                    onMouseEnter={(e) => dragState.isDragging && dragState.dragType === 'item' && handleDragOver(e, itemIndex)}
                    style={{
                      backgroundColor: dragState.isDragging && dragState.dragType === 'item' && dragState.overIndex === itemIndex ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                      borderRadius: '0.75rem',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <button
                      onMouseDown={(e) => handleDragStart(e, 'item', item, itemIndex, category.id, category.subcategories.find(sub => sub.name === '默认')?.id)}
                      onTouchStart={(e) => handleDragStart(e, 'item', item, itemIndex, category.id, category.subcategories.find(sub => sub.name === '默认')?.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing"
                      title="拖动排序"
                      style={{
                        opacity: dragState.isDragging && dragState.dragType === 'item' && dragState.draggedIndex === itemIndex ? 0.5 : 1
                      }}
                    >
                      <Icon name="GripVertical" className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        if (isMobile) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`flex-1 flex items-center space-x-3 p-3 rounded-xl transition ${
                        selectedItem?.id === item.id ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'
                      }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm">
                        {item.website[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-gray-800">{item.website}</div>
                        <div className="text-xs text-gray-500">{item.accounts?.length || 0} 账户</div>
                      </div>
                    </button>
                  </div>
                ))}

                {category.subcategories
                  ?.filter(sub => sub.name !== '默认')
                  .map((subcategory, subcategoryIndex) => (
                    <div key={subcategory.id} className="ml-6 space-y-1">
                      <div 
                        className="flex items-center gap-2"
                        onMouseEnter={(e) => dragState.isDragging && dragState.dragType === 'subcategory' && handleDragOver(e, subcategoryIndex)}
                        style={{
                          backgroundColor: dragState.isDragging && dragState.dragType === 'subcategory' && dragState.overIndex === subcategoryIndex ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                          borderRadius: '0.75rem',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <button
                          onMouseDown={(e) => handleDragStart(e, 'subcategory', subcategory, subcategoryIndex, category.id)}
                          onTouchStart={(e) => handleDragStart(e, 'subcategory', subcategory, subcategoryIndex, category.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing"
                          title="拖动排序"
                          style={{
                            opacity: dragState.isDragging && dragState.dragType === 'subcategory' && dragState.draggedIndex === subcategoryIndex ? 0.5 : 1
                          }}
                        >
                          <Icon name="GripVertical" className="w-4 h-4" />
                        </button>
                        
                        <div className="flex-1 flex items-center justify-between px-3 py-2">
                          <div className="text-xs font-semibold text-gray-500">{subcategory.name}</div>
                        </div>
                      </div>
                      
                      {subcategory.items?.map((item, itemIndex) => (
                        <div 
                          key={item.id} 
                          className="flex items-center gap-2"
                          onMouseEnter={(e) => dragState.isDragging && dragState.dragType === 'item' && handleDragOver(e, itemIndex)}
                          style={{
                            backgroundColor: dragState.isDragging && dragState.dragType === 'item' && dragState.overIndex === itemIndex ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                            borderRadius: '0.75rem',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <button
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, 'item', item, itemIndex, category.id, subcategory.id);
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, 'item', item, itemIndex, category.id, subcategory.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing"
                            title="拖动排序"
                            style={{
                              opacity: dragState.isDragging && dragState.dragType === 'item' && dragState.draggedIndex === itemIndex ? 0.5 : 1
                            }}
                          >
                            <Icon name="GripVertical" className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              if (isMobile) {
                                setSidebarOpen(false);
                              }
                            }}
                            className={`flex-1 flex items-center space-x-3 p-3 rounded-xl transition ${
                              selectedItem?.id === item.id ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'
                            }`}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            <div className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm">
                              {item.website[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-semibold text-gray-800">{item.website}</div>
                              <div className="text-xs text-gray-500">{item.accounts?.length || 0} 账户</div>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  ))
                }
              </>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={() => setShowCategoryModal(true)}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:shadow-lg transition transform hover:scale-[1.02] font-semibold text-sm"
        >
          <Icon name="Plus" />
          <span>分类管理</span>
        </button>
        <button
          onClick={onIconManagement}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:shadow-lg transition transform hover:scale-[1.02] font-semibold text-sm"
        >
          <Icon name="Image" className="w-5 h-5" />
          <span>图标管理</span>
        </button>
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
        >
          <Icon name="Download" />
          <span>导出 CSV</span>
        </button>
      </div>
    </div>
  );
};

// 顶部栏组件
const TopBar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  selectedItem, 
  currentUser, 
  onLogout 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Icon name="Menu" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {selectedItem ? selectedItem.website : '选择一个项目'}
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <div className="px-4 py-2 bg-gray-100 rounded-lg hidden md:block">
          <span className="text-sm font-medium text-gray-700">{currentUser}</span>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
        >
          登出
        </button>
      </div>
    </div>
  );
};

// 空状态组件
const EmptyState = () => {
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-3xl flex items-center justify-center">
          <Icon name="Key" className="w-12 h-12 text-gray-300" />
        </div>
        <p className="text-xl font-medium">选择一个项目查看详情</p>
        <p className="text-sm mt-2">或使用分类管理添加新项目</p>
      </div>
    </div>
  );
};

// 密码详情组件 - 修复后的版本
const PasswordDetail = ({ 
  selectedItem, 
  showPassword, 
  setShowPassword, 
  onCopy, 
  onDelete,
  editingAccount,
  onToggleEdit,
  onEditField,
  onAddAccount,
  onEdit,
  onSelectIcon
}) => {
  if (!selectedItem) return <EmptyState />;

  // 确保使用全局 getPasswordStrength 函数
  const getStrength = (password) => {
    if (typeof window.getPasswordStrength === 'function') {
      return window.getPasswordStrength(password);
    }
    // 回退方案
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-2xl text-white font-bold shadow-lg">
                {selectedItem.website[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedItem.website}</h2>
                <a 
                  href={selectedItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-orange-600 hover:underline"
                >
                  {selectedItem.url}
                </a>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onAddAccount}
                className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition"
                title="添加账户"
              >
                <Icon name="Plus" className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEdit && onEdit()}
                className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition"
                title="修改密码"
              >
                <Icon name="Edit" className="w-5 h-5" />
              </button>
              <button
                onClick={onSelectIcon}
                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                title="更换图标"
              >
                <Icon name="Image" className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                title="删除项目"
              >
                <Icon name="Trash2" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {selectedItem.accounts && selectedItem.accounts.length > 0 ? (
              selectedItem.accounts.map((account, index) => {
                const strength = getStrength(account.password);
                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 md:p-5 space-y-4 border border-gray-200">
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700">账户 {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{strength.label}</span>
                        <div className={`w-16 h-1.5 rounded-full ${strength.color}`}></div>
                      </div>
                    </div>
                    
                    {account.username && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600">用户名</label>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <input
                            type="text"
                            value={account.username}
                            readOnly
                            className="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-white border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() => onCopy(account.username, '用户名')}
                            className="p-2 md:p-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-sm flex-shrink-0"
                          >
                            <Icon name="Copy" className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {account.password && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600">密码</label>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <input
                            type={showPassword[`${selectedItem.id}-${index}`] ? 'text' : 'password'}
                            value={account.password}
                            readOnly
                            className="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-white border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={() => setShowPassword(prev => ({
                              ...prev,
                              [`${selectedItem.id}-${index}`]: !prev[`${selectedItem.id}-${index}`]
                            }))}
                            className="p-2 md:p-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex-shrink-0"
                          >
                            <Icon name={showPassword[`${selectedItem.id}-${index}`] ? 'EyeOff' : 'Eye'} className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => onCopy(account.password, '密码')}
                            className="p-2 md:p-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-sm flex-shrink-0"
                          >
                            <Icon name="Copy" className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {account.note && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600">备注</label>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">
                          {account.note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>该项目还没有账户信息</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};