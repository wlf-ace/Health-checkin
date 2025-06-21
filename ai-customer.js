
(function() {
  
  const ball = document.createElement('div');
  ball.id = 'ai-customer-ball';
  ball.style.position = 'fixed';
  ball.style.right = '32px';
  ball.style.bottom = '32px';
  ball.style.width = '56px';
  ball.style.height = '56px';
  ball.style.background = 'linear-gradient(135deg,#4f8cff,#6edfff)';
  ball.style.borderRadius = '50%';
  ball.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
  ball.style.display = 'flex';
  ball.style.alignItems = 'center';
  ball.style.justifyContent = 'center';
  ball.style.cursor = 'pointer';
  ball.style.zIndex = 9999;
  ball.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';

  // 创建对话框
  const dialog = document.createElement('div');
  dialog.id = 'ai-customer-dialog';
  dialog.style.position = 'fixed';
  dialog.style.right = '32px';
  dialog.style.bottom = '100px';
  dialog.style.width = '340px';
  dialog.style.maxHeight = '60vh';
  dialog.style.background = '#fff';
  dialog.style.borderRadius = '16px';
  dialog.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
  dialog.style.display = 'none';
  dialog.style.flexDirection = 'column';
  dialog.style.overflow = 'hidden';
  dialog.style.zIndex = 9999;

  // 对话内容区
  const chatArea = document.createElement('div');
  chatArea.style.flex = '1';
  chatArea.style.overflowY = 'auto';
  chatArea.style.padding = '20px 16px 12px 16px';
  chatArea.style.background = '#f7faff';

  // 输入区
  const inputArea = document.createElement('div');
  inputArea.style.display = 'flex';
  inputArea.style.alignItems = 'center';
  inputArea.style.padding = '12px 16px';
  inputArea.style.background = '#fff';
  inputArea.style.borderTop = '1px solid #e6e6e6';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = '请输入您的问题...';
  input.style.flex = '1';
  input.style.border = 'none';
  input.style.outline = 'none';
  input.style.fontSize = '15px';
  input.style.background = 'transparent';

  const sendBtn = document.createElement('button');
  sendBtn.textContent = '发送';
  sendBtn.style.marginLeft = '8px';
  sendBtn.style.background = 'linear-gradient(135deg,#4f8cff,#6edfff)';
  sendBtn.style.color = '#fff';
  sendBtn.style.border = 'none';
  sendBtn.style.borderRadius = '8px';
  sendBtn.style.padding = '6px 16px';
  sendBtn.style.fontSize = '15px';
  sendBtn.style.cursor = 'pointer';

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);

  dialog.appendChild(chatArea);
  dialog.appendChild(inputArea);

  document.body.appendChild(ball);
  document.body.appendChild(dialog);

  // 动态引入marked.js
  if (!window.marked) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(script);
  }

  // 展示欢迎语
  function showWelcome() {
    fetch('/api/ai-chat/welcome')
      .then(res => res.json())
      .then(data => {
        addMsg('ai', data.reply);
      });
  }

  // 添加消息气泡
  function addMsg(role, text) {
    const msg = document.createElement('div');
    msg.style.display = 'flex';
    msg.style.marginBottom = '10px';
    msg.style.justifyContent = role === 'user' ? 'flex-end' : 'flex-start';
    const bubble = document.createElement('div');
    // AI回复用Markdown渲染
    if (role === 'ai' && window.marked) {
      bubble.innerHTML = window.marked.parse(text);
      bubble.classList.add('ai-markdown');
    } else {
      bubble.textContent = text;
    }
    bubble.style.maxWidth = '70%';
    bubble.style.padding = '10px 14px';
    bubble.style.borderRadius = '16px';
    bubble.style.fontSize = '15px';
    bubble.style.lineHeight = '1.6';
    bubble.style.wordBreak = 'break-all';
    if (role === 'user') {
      bubble.style.background = 'linear-gradient(135deg,#4f8cff,#6edfff)';
      bubble.style.color = '#fff';
      bubble.style.borderBottomRightRadius = '4px';
    } else {
      bubble.style.background = '#f0f4fa';
      bubble.style.color = '#222';
      bubble.style.borderBottomLeftRadius = '4px';
    }
    msg.appendChild(bubble);
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // 发送消息
  async function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    addMsg('user', text);
    input.value = '';
    sendBtn.disabled = true;
    addMsg('ai', '思考中...');
    // 收集历史消息
    const bubbles = chatArea.querySelectorAll('div');
    const messages = [];
    for (let i = 0; i < bubbles.length; i++) {
      const t = bubbles[i].textContent;
      if (!t) continue;
      if (bubbles[i].style.justifyContent === 'flex-end') {
        messages.push({ role: 'user', content: t });
      } else {
        messages.push({ role: 'assistant', content: t });
      }
    }
    // 只保留最近10条
    const last10 = messages.slice(-10);
    last10.unshift({ role: 'system', content: '你是健康打卡AI助手星火，擅长健康、饮食、运动、打卡等问题解答。' });
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: last10 })
      });
      const data = await res.json();
      
      chatArea.removeChild(chatArea.lastChild);
      addMsg('ai', data.reply);
    } catch (e) {
      chatArea.removeChild(chatArea.lastChild);
      addMsg('ai', 'AI服务暂时不可用，请稍后再试。');
    }
    sendBtn.disabled = false;
  }

  // 事件绑定
  ball.onclick = function() {
    dialog.style.display = dialog.style.display === 'none' ? 'flex' : 'none';
    if (dialog.style.display === 'flex' && chatArea.childElementCount === 0) {
      showWelcome();
    }
  };
  sendBtn.onclick = sendMsg;
  input.onkeydown = function(e) {
    if (e.key === 'Enter') sendMsg();
  };
})(); 