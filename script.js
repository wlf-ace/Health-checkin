// 全局错误提示函数，确保所有表单回调可用
function showAuthError(msg, success = false) {
    const authError = document.getElementById('authError');
    if (!authError) return;
    authError.textContent = msg;
    authError.style.display = '';
    authError.style.color = success ? '#4CAF50' : '#f44336';
}

// 导航栏交互
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const downloadBtn = document.querySelector('.download-btn');

    // 汉堡菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 下载按钮点击事件
    downloadBtn.addEventListener('click', function() {
        // 这里可以添加实际的下载逻辑
        showDownloadModal();
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    const API_BASE_URL = 'http://localhost:3000';
    // 登录表单提交
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('user_id', data.userId);
                    localStorage.setItem('username', data.username);
                    setLoginState();
                    closeLoginModal();
                    location.reload();
                } else {
                    showAuthError(data.error || '登录失败');
                }
            } catch (err) {
                showAuthError('登录失败');
            }
        });
    }
    // 注册表单提交
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value;
            try {
                const res = await fetch(`${API_BASE_URL}/api/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (res.ok) {
                    switchToLogin();
                    showAuthError('注册成功，请登录', true);
                } else {
                    showAuthError(data.error || '注册失败');
                }
            } catch (err) {
                showAuthError('注册失败');
            }
        });
    }
});

// 显示下载模态框
function showDownloadModal() {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>下载健康打卡应用</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="download-options">
                    <div class="download-option">
                        <i class="fab fa-android"></i>
                        <h4>Android 版本</h4>
                        <p>支持 Android 8.0 及以上版本</p>
                        <button class="download-option-btn android-btn">
                            <i class="fab fa-google-play"></i>
                            从 Google Play 下载
                        </button>
                    </div>
                    <div class="download-option">
                        <i class="fab fa-apple"></i>
                        <h4>iOS 版本</h4>
                        <p>支持 iOS 12.0 及以上版本</p>
                        <button class="download-option-btn ios-btn">
                            <i class="fab fa-app-store"></i>
                            从 App Store 下载
                        </button>
                    </div>
                    <div class="download-option">
                        <i class="fas fa-globe"></i>
                        <h4>Web 版本</h4>
                        <p>无需下载，直接在浏览器中使用</p>
                        <button class="download-option-btn web-btn">
                            <i class="fas fa-external-link-alt"></i>
                            立即体验
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 添加模态框样式
    const style = document.createElement('style');
    style.textContent = `
        .download-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }

        .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 30px;
            border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
            margin: 0;
            color: #333;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .close-btn:hover {
            color: #333;
        }

        .modal-body {
            padding: 30px;
        }

        .download-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .download-option {
            text-align: center;
            padding: 20px;
            border: 2px solid #f0f0f0;
            border-radius: 15px;
            transition: all 0.3s ease;
        }

        .download-option:hover {
            border-color: #4CAF50;
            transform: translateY(-5px);
        }

        .download-option i {
            font-size: 3rem;
            margin-bottom: 15px;
            color: #4CAF50;
        }

        .download-option h4 {
            margin: 0 0 10px 0;
            color: #333;
        }

        .download-option p {
            margin: 0 0 20px 0;
            color: #666;
            font-size: 0.9rem;
        }

        .download-option-btn {
            width: 100%;
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .android-btn {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
        }

        .ios-btn {
            background: linear-gradient(45deg, #007AFF, #0056CC);
            color: white;
        }

        .web-btn {
            background: linear-gradient(45deg, #FF6B35, #F7931E);
            color: white;
        }

        .download-option-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 768px) {
            .download-options {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
    });

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });

    // 下载按钮点击事件
    const downloadBtns = modal.querySelectorAll('.download-option-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('android-btn') ? 'Android' :
                           this.classList.contains('ios-btn') ? 'iOS' : 'Web';
            
            // 这里可以添加实际的下载逻辑
            console.log(`用户选择了 ${platform} 版本`);
            
            // 模拟下载过程
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 准备中...';
            this.disabled = true;
            
            setTimeout(() => {
                alert(`${platform} 版本下载功能即将上线，敬请期待！`);
                modal.remove();
                style.remove();
            }, 2000);
        });
    });
}

// 添加一些动画效果
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 页面加载完成后初始化动画
window.addEventListener('load', addScrollAnimations);

// 登录/注册弹窗逻辑优化
(function() {
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const authError = document.getElementById('authError');
    let activeTab = 'login';

    function showLoginModal(tab = 'login') {
        loginModal.style.display = 'block';
        setTab(tab);
        authError.style.display = 'none';
    }
    window.showLoginModal = showLoginModal;

    function closeLoginModal() {
        loginModal.style.display = 'none';
        clearForm();
    }
    window.closeLoginModal = closeLoginModal;

    function setTab(tab) {
        activeTab = tab;
        if (tab === 'login') {
            loginForm.style.display = '';
            registerForm.style.display = 'none';
            document.getElementById('loginModalTitle').textContent = '登录';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = '';
            document.getElementById('loginModalTitle').textContent = '注册';
        }
        authError.style.display = 'none';
    }
    window.switchToRegister = function() { setTab('register'); };
    window.switchToLogin = function() { setTab('login'); };

    // 只监听弹窗遮罩点击关闭
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) closeLoginModal();
    });

    function setAuthLoading(loading) {
        const btns = loginModal.querySelectorAll('button[type="submit"]');
        btns.forEach(btn => {
            btn.disabled = loading;
            btn.innerHTML = loading ? '<span class="spinner"></span>处理中...' : (btn.form === loginForm ? '登录' : '注册');
        });
    }
    function clearForm() {
        loginForm && loginForm.reset();
        registerForm && registerForm.reset();
        authError.style.display = 'none';
    }
    // 登录状态切换
    window.setLoginState = function() {
        const userId = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');
        if (userId && username) {
            loginBtn.style.display = 'none';
            userInfo.style.display = '';
            userInfo.innerHTML = `<span style='margin-right:10px;'>👤 ${username}</span><button class='btn btn-outline' onclick='logout()'>退出</button>`;
        } else {
            loginBtn.style.display = '';
            userInfo.style.display = 'none';
            userInfo.innerHTML = '';
        }
    }
    window.logout = function() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        setLoginState();
        location.reload();
    }
    setLoginState();
})();

// axios请求自动带user_id
if (window.axios) {
    axios.interceptors.request.use(config => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            // 只对本地API加user_id参数
            if (config.url.startsWith('/api/') || config.url.startsWith('http://localhost:3000/api/')) {
                if (config.method === 'get') {
                    config.params = config.params || {};
                    config.params.user_id = userId;
                } else if (config.data && typeof config.data === 'object') {
                    config.data.user_id = userId;
                }
            }
        }
        return config;
    });
} 