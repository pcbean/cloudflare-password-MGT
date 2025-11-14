// 主应用入口
const { useState, useEffect } = React;

// 安全状态进度条组件
const SecurityProgressBar = ({ categories }) => {
  const security = calculateOverallSecurity(categories);
  
  if (security.total === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">安全状态总览</h3>
          <span className="text-xs text-gray-500">{security.total} 个密码</span>
        </div>
        
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
          {security.strong > 0 && (
            <div 
              className="bg-green-500 h-full transition-all duration-500" 
              style={{ width: `${security.strongPercent}%` }}
              title={`强密码: ${security.strong} 个 (${security.strongPercent}%)`}
            ></div>
          )}
          {security.medium > 0 && (
            <div 
              className="bg-yellow-500 h-full transition-all duration-500" 
              style={{ width: `${security.mediumPercent}%` }}
              title={`中等密码: ${security.medium} 个 (${security.mediumPercent}%)`}
            ></div>
          )}
          {security.weak > 0 && (
            <div 
              className="bg-red-500 h-full transition-all duration-500" 
              style={{ width: `${security.weakPercent}%` }}
              title={`弱密码: ${security.weak} 个 (${security.weakPercent}%)`}
            ></div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">强 {security.strong}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">中 {security.medium}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">弱 {security.weak}</span>
            </div>
          </div>
          {security.weak > 0 && (
            <span className="text-red-600 font-medium">⚠️ {security.weak} 个弱密码需要更新</span>
          )}
        </div>
      </div>
    </div>
  );
};

// 示例数据
const SAMPLE_DATA = {
  categories: [
    {
      id: '1',
      name: 'Docker',
      icon: '🐳',
      color: 'from-blue-500 to-cyan-500',
      subcategories: [
        {
          id: '1-1',
          name: '存储平台',
          items: [
            {
              id: '1-1-1',
              website: 'Docker Hub',
              url: 'https://hub.docker.com',
              favicon: 'https://www.google.com/s2/favicons?domain=hub.docker.com&sz=128',
              accounts: [
                { username: 'admin@example.com', password: 'docker123', note: '主账号' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

function PasswordManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUsers, setAdminUsers] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [selectedCategoryForAdd, setSelectedCategoryForAdd] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingAccount, setEditingAccount] = useState({});
  const [showIconManagementModal, setShowIconManagementModal] = useState(false);
  const [showIconSelectorModal, setShowIconSelectorModal] = useState(false);
  const [iconSelectorTarget, setIconSelectorTarget] = useState(null);
  const [uploadedIcons, setUploadedIcons] = useState([]);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    const fetchEnvUsers = async () => {
      try {
        const response = await fetch('/api/get-env-users');
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          setAdminUsers({}); 
          return;
        }
        const data = await response.json();
        if (data.users && Object.keys(data.users).length > 0) {
          setAdminUsers(data.users);
        } else {
          setAdminUsers({}); 
        }
      } catch (error) {
        setAdminUsers({}); 
      }
    };
    fetchEnvUsers();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let isSidebarGesture = false;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      
      if (touchStartX < 20) {
        isSidebarGesture = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isSidebarGesture) return;
      
      touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      
      if (deltaX > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isSidebarGesture) return;
      
      const deltaX = touchCurrentX - touchStartX;
      
      if (deltaX > 50) {
        setSidebarOpen(true);
      }
      
      isSidebarGesture = false;
      touchStartX = 0;
      touchStartY = 0;
      touchCurrentX = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadData();
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const loadIcons = async () => {
      try {
        const result = await storage.get(`icons_${currentUser}`);
        if (result && result.value) {
          setUploadedIcons(JSON.parse(result.value));
        }
      } catch (error) {
        console.error('加载图标失败:', error);
      }
    };
    if (currentUser) {
      loadIcons();
    }
  }, [currentUser]);

  const showNotificationFunc = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = async () => {
    console.log('=== 开始加载数据 ===');
    console.log('当前用户:', currentUser);
    try {
      const result = await storage.get(`passwords_${currentUser}`);
      console.log('Storage 返回结果:', result);
      
      if (result && result.value) {
        const data = JSON.parse(result.value);
        console.log('解析后的数据:', data);
        console.log('分类数量:', data.categories?.length);
        
        if (data.categories && data.categories.length > 0) {
          console.log('第一个分类:', data.categories[0]);
          console.log('第一个分类的子分类:', data.categories[0].subcategories);
        }
        
        setCategories(data.categories || []);
      } else {
        console.log('没有找到数据,使用示例数据');
        setCategories(SAMPLE_DATA.categories);
        await saveData(SAMPLE_DATA.categories);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      showNotificationFunc('加载数据失败', 'error');
    }
  };

  const saveData = async (data) => {
    try {
      await storage.set(`passwords_${currentUser}`, JSON.stringify({ categories: data }));
      setCategories(data);
    } catch (error) {
      console.error('保存失败:', error);
      showNotificationFunc('保存失败', 'error');
      throw error;
    }
  };

  const saveIcons = async (icons) => {
    try {
      await storage.set(`icons_${currentUser}`, JSON.stringify(icons));
      setUploadedIcons(icons);
    } catch (error) {
      showNotificationFunc('保存图标失败', 'error');
    }
  };

        const handleLogin = (username, password) => {
    console.log('=== 登录尝试 ===');
    console.log('用户名:', username);
    console.log('所有用户:', Object.keys(adminUsers));
    
    if (adminUsers[username] && adminUsers[username] === password) {
      console.log('✅ 登录成功');
      setIsAuthenticated(true);
      setCurrentUser(username);
      showNotificationFunc(`欢迎回来, ${username}!`);
      
      // 手机端登录后打开侧边栏
      if (window.innerWidth < 768) {
        setSidebarOpen(true);
      }
      
      return true;
    } else {
      console.log('❌ 登录失败');
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCategories([]);
    setSelectedItem(null);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleToggleEdit = async (itemId, accountIndex, field) => {
    const key = `${itemId}-${accountIndex}-${field}`;
    if (editingAccount[key]) {
      try {
        await saveData(categories);
        showNotificationFunc(`${field === 'username' ? '用户名' : '密码'}已更新`);
        setEditingAccount(prev => ({ ...prev, [key]: false }));
        
        const updatedItem = categories
          .flatMap(c => c.subcategories.flatMap(s => s.items))
          .find(i => i.id === itemId);
        if (updatedItem) {
          setSelectedItem(updatedItem);
        }
      } catch (error) {
        showNotificationFunc('保存失败', 'error');
      }
    } else {
      setEditingAccount(prev => ({ ...prev, [key]: true }));
    }
  };

  const handleEditField = (itemId, accountIndex, field, value) => {
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
    setCategories(updatedCategories);
    
    const updatedItem = updatedCategories
      .flatMap(c => c.subcategories.flatMap(s => s.items))
      .find(i => i.id === itemId);
    if (updatedItem) {
      setSelectedItem(updatedItem);
    }
  };

  const handleAddAccount = async () => {
    if (!selectedItem) return;
    setSelectedCategoryForAdd(selectedItem.id);
    setShowAddPasswordModal(true);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    if (!confirm('确定要删除这个项目吗?')) return;

    try {
      const updatedCategories = categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          items: sub.items.filter(item => item.id !== selectedItem.id)
        })).filter(sub => sub.items.length > 0)
      })).filter(cat => cat.subcategories.length > 0);

      await saveData(updatedCategories);
      setSelectedItem(null);
      showNotificationFunc('项目已删除');
    } catch (error) {
      showNotificationFunc('删除失败', 'error');
    }
  };

  const handleAddPassword = async (newPasswordData) => {
    try {
      if (selectedItem && selectedCategoryForAdd === selectedItem.id) {
        const updatedCategories = categories.map(cat => ({
          ...cat,
          subcategories: cat.subcategories.map(sub => ({
            ...sub,
            items: sub.items.map(item => {
              if (item.id === selectedItem.id) {
                return {
                  ...item,
                  accounts: [...item.accounts, {
                    username: newPasswordData.username || '',
                    password: newPasswordData.password || '',
                    note: newPasswordData.note || ''
                  }]
                };
              }
              return item;
            })
          }))
        }));
        
        await saveData(updatedCategories);
        
        const updatedItem = updatedCategories
          .flatMap(c => c.subcategories.flatMap(s => s.items))
          .find(i => i.id === selectedItem.id);
        setSelectedItem(updatedItem);
        
        showNotificationFunc('账户已添加');
      } else {
        const updatedCategories = await addNewPassword(
          newPasswordData,
          categories,
          saveData,
          showNotificationFunc
        );
        if (updatedCategories) {
          await loadData();
        }
      }
      
      setShowAddPasswordModal(false);
      setSelectedCategoryForAdd(null);
    } catch (error) {
      showNotificationFunc('添加失败', 'error');
    }
  };

  const handleExport = () => {
    exportToCSV(categories, currentUser, showNotificationFunc);
  };

  const handleCopy = (text, type) => {
    copyToClipboard(text, type, showNotificationFunc);
  };

  const handleIconManagement = () => {
    setShowIconManagementModal(true);
  };

  const handleSelectIcon = (type, id) => {
    setIconSelectorTarget({ type, id });
    setShowIconSelectorModal(true);
  };

  const handleReorderCategories = async (fromIndex, toIndex) => {
    const newCategories = [...categories];
    const [removed] = newCategories.splice(fromIndex, 1);
    newCategories.splice(toIndex, 0, removed);
    setCategories(newCategories);
    try {
      await storage.set(`passwords_${currentUser}`, JSON.stringify({ categories: newCategories }));
    } catch (error) {
      console.error('保存失败:', error);
      showNotificationFunc('保存失败', 'error');
    }
  };

  const handleReorderSubcategories = async (categoryId, fromIndex, toIndex) => {
    const newCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const nonDefaultSubs = cat.subcategories.filter(sub => sub.name !== '默认');
        const defaultSub = cat.subcategories.find(sub => sub.name === '默认');
        const [removed] = nonDefaultSubs.splice(fromIndex, 1);
        nonDefaultSubs.splice(toIndex, 0, removed);
        return {
          ...cat,
          subcategories: defaultSub ? [defaultSub, ...nonDefaultSubs] : nonDefaultSubs
        };
      }
      return cat;
    });
    setCategories(newCategories);
    try {
      await storage.set(`passwords_${currentUser}`, JSON.stringify({ categories: newCategories }));
    } catch (error) {
      console.error('保存失败:', error);
      showNotificationFunc('保存失败', 'error');
    }
  };

  const handleReorderItems = async (categoryId, subcategoryId, fromIndex, toIndex) => {
    const newCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(sub => {
            if (sub.id === subcategoryId) {
              const newItems = [...sub.items];
              const [removed] = newItems.splice(fromIndex, 1);
              newItems.splice(toIndex, 0, removed);
              return { ...sub, items: newItems };
            }
            return sub;
          })
        };
      }
      return cat;
    });
    setCategories(newCategories);
    try {
      await storage.set(`passwords_${currentUser}`, JSON.stringify({ categories: newCategories }));
    } catch (error) {
      console.error('保存失败:', error);
      showNotificationFunc('保存失败', 'error');
    }
  };

  const handleIconSelect = async (iconData) => {
    if (!iconSelectorTarget) return;
    
    const { type, id } = iconSelectorTarget;
    
    if (type === 'category') {
      const updatedCategories = categories.map(cat => 
        cat.id === id ? { ...cat, icon: iconData } : cat
      );
      await saveData(updatedCategories);
    } else if (type === 'item') {
      const updatedCategories = categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          items: sub.items.map(item => 
            item.id === id ? { ...item, favicon: iconData } : item
          )
        }))
      }));
      await saveData(updatedCategories);
    }
    
    setShowIconSelectorModal(false);
    setIconSelectorTarget(null);
    showNotificationFunc('图标已更新');
  };

  const handleEditItem = async (editedData) => {
    try {
      let updatedCategories = categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          items: sub.items.filter(item => item.id !== itemToEdit.id)
        }))
      }));

      const updatedItem = {
        ...itemToEdit,
        website: editedData.website,
        url: editedData.url,
        accounts: editedData.accounts
      };

      updatedCategories = updatedCategories.map(cat => {
        if (cat.id === editedData.categoryId) {
          if (!editedData.subcategoryId) {
            let defaultSub = cat.subcategories.find(sub => sub.name === '默认');
            
            if (!defaultSub) {
              return {
                ...cat,
                subcategories: [
                  {
                    id: `${cat.id}-default`,
                    name: '默认',
                    items: [updatedItem]
                  },
                  ...cat.subcategories
                ]
              };
            } else {
              return {
                ...cat,
                subcategories: cat.subcategories.map(sub => {
                  if (sub.name === '默认') {
                    return {
                      ...sub,
                      items: [...sub.items, updatedItem]
                    };
                  }
                  return sub;
                })
              };
            }
          }
          
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id === editedData.subcategoryId) {
                return {
                  ...sub,
                  items: [...sub.items, updatedItem]
                };
              }
              return sub;
            })
          };
        }
        return cat;
      });

      await saveData(updatedCategories);
      const newUpdatedItem = updatedCategories
        .flatMap(c => c.subcategories.flatMap(s => s.items))
        .find(i => i.id === itemToEdit.id);
      setSelectedItem(newUpdatedItem);
      setShowEditItemModal(false);
      setItemToEdit(null);
      showNotificationFunc('项目已更新');
    } catch (error) {
      showNotificationFunc('更新失败', 'error');
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const filteredCategories = filterItems(categories, searchTerm);
  const totalPasswords = categories.reduce((acc, cat) => 
    acc + (cat.subcategories?.reduce((a, sub) => a + (sub.items?.length || 0), 0) || 0), 0
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Notification notification={notification} />
      
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        totalPasswords={totalPasswords}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredCategories={filteredCategories}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        setShowCategoryModal={setShowCategoryModal}
        onExport={handleExport}
        onAddPassword={(categoryId) => {
          setSelectedCategoryForAdd(categoryId);
          setShowAddPasswordModal(true);
        }}
        onIconManagement={handleIconManagement}
        onSelectIcon={handleSelectIcon}
        onReorderCategories={handleReorderCategories}
        onReorderSubcategories={handleReorderSubcategories}
        onReorderItems={handleReorderItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedItem={selectedItem}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <SecurityProgressBar categories={categories} />

        <div className="flex-1 overflow-y-auto p-2 md:p-4">
          <PasswordDetail 
            selectedItem={selectedItem}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onCopy={handleCopy}
            onDelete={handleDeleteItem}
            editingAccount={editingAccount}
            onToggleEdit={handleToggleEdit}
            onEditField={handleEditField}
            onAddAccount={handleAddAccount}
            onEdit={() => {
              setItemToEdit(selectedItem);
              setShowEditItemModal(true);
            }}
            onSelectIcon={() => handleSelectIcon('item', selectedItem?.id)}
          />
        </div>
      </div>

      <CategoryManagementModal 
        showModal={showCategoryModal}
        setShowModal={setShowCategoryModal}
        categories={categories}
        onSave={saveData}
        showNotification={showNotificationFunc}
      />

      <AddPasswordModal 
        showModal={showAddPasswordModal}
        setShowModal={setShowAddPasswordModal}
        categories={categories}
        selectedCategoryId={selectedCategoryForAdd}
        onAdd={handleAddPassword}
      />

      <IconManagementModal 
        showModal={showIconManagementModal}
        setShowModal={setShowIconManagementModal}
        icons={uploadedIcons}
        onSave={saveIcons}
        showNotification={showNotificationFunc}
      />

      <IconSelectorModal 
        showModal={showIconSelectorModal}
        setShowModal={setShowIconSelectorModal}
        icons={uploadedIcons}
        onSelect={handleIconSelect}
      />

      <EditItemModal 
        showModal={showEditItemModal}
        setShowModal={setShowEditItemModal}
        itemToEdit={itemToEdit}
        categories={categories}
        onSave={handleEditItem}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PasswordManager />);