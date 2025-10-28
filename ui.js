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
  onSelectIcon
}) => {
  if (!sidebarOpen) return null;

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
        {filteredCategories.map(category => (
          <div key={category.id} className="space-y-1">
            <div className="w-full flex items-center gap-2">
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex-1 flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition group"
              >
                 <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center overflow-hidden shadow-sm`}>
                    {category.icon && category.icon.startsWith('data:image') ? (
                      <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
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
                {/* 先渲染"默认"子分类中的所有密码项,直接显示在大类展开区域 */}
                {category.subcategories?.find(sub => sub.name === '默认')?.items?.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${
                      selectedItem?.id === item.id ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm">
                      {item.website[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold text-gray-800">{item.website}</div>
                      <div className="text-xs text-gray-500">{item.accounts?.length || 0} 账户</div>
                    </div>
                  </button>
                ))}

                {/* 渲染其他非"默认"子分类 */}
                {category.subcategories
                  ?.filter(sub => sub.name !== '默认')
                  .map(subcategory => (
                    <div key={subcategory.id} className="ml-6 space-y-1">
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="text-xs font-semibold text-gray-500">{subcategory.name}</div>
                      </div>
                      {subcategory.items?.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-xl transition ${
                            selectedItem?.id === item.id ? 'bg-gray-100 border border-gray-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm">
                            {item.website[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-semibold text-gray-800">{item.website}</div>
                            <div className="text-xs text-gray-500">{item.accounts?.length || 0} 账户</div>
                          </div>
                        </button>
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

// 密码详情组件
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
  onSelectIcon
}) => {
  if (!selectedItem) return <EmptyState />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            {selectedItem.accounts?.map((account, index) => {
              const strength = getPasswordStrength(account.password);
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">账户 {index + 1}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{strength.label}</span>
                      <div className={`w-16 h-1.5 rounded-full ${strength.color}`}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600">用户名</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={account.username}
                        readOnly={!editingAccount[`${selectedItem.id}-${index}-username`]}
                        onChange={(e) => onEditField(selectedItem.id, index, 'username', e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => onToggleEdit(selectedItem.id, index, 'username')}
                        className="p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
                        title={editingAccount[`${selectedItem.id}-${index}-username`] ? '保存' : '编辑'}
                      >
                        <Icon name={editingAccount[`${selectedItem.id}-${index}-username`] ? 'Check' : 'Edit'} className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onCopy(account.username, '用户名')}
                        className="p-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-sm"
                      >
                        <Icon name="Copy" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600">密码</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type={showPassword[`${selectedItem.id}-${index}`] ? 'text' : 'password'}
                        value={account.password}
                        readOnly={!editingAccount[`${selectedItem.id}-${index}-password`]}
                        onChange={(e) => onEditField(selectedItem.id, index, 'password', e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => onToggleEdit(selectedItem.id, index, 'password')}
                        className="p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
                        title={editingAccount[`${selectedItem.id}-${index}-password`] ? '保存' : '编辑'}
                      >
                        <Icon name={editingAccount[`${selectedItem.id}-${index}-password`] ? 'Check' : 'Edit'} className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowPassword(prev => ({
                          ...prev,
                          [`${selectedItem.id}-${index}`]: !prev[`${selectedItem.id}-${index}`]
                        }))}
                        className="p-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        <Icon name={showPassword[`${selectedItem.id}-${index}`] ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onCopy(account.password, '密码')}
                        className="p-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-sm"
                      >
                        <Icon name="Copy" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {account.note && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-600">备注</label>
                      <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                        {account.note}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};