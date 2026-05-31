import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, push, onChildAdded } from "https://gstatic.com";

// 你的专属 Firebase 云端配置
const firebaseConfig = { 
    apiKey: "AIzaSyB4e4FOw71XX155mFadqpOxn7hSH7BNWYg", 
    authDomain: "my-chat-room-83418.firebaseapp.com", 
    projectId: "my-chat-room-83418", 
    storageBucket: "my-chat-room-83418.firebasestorage.app", 
    messagingSenderId: "694895631506", 
    appId: "1:694895631506:web:f968e207341b6d6730da4b", 
    measurementId: "G-ZG5F59HBZ5" 
};

// 初始化项目
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'chat_messages'); // 云端存储聊天记录的表名

// 绑定网页元素
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const usernameInput = document.getElementById('usernameInput');
const sendBtn = document.getElementById('sendBtn');

// 发送消息的函数
function sendMessage() {
    const text = userInput.value.trim();
    const username = usernameInput.value.trim() || "匿名者";
    if (!text) return;

    // 将数据推送到 Firebase 云端，数据一变，所有人都会实时更新
    push(messagesRef, {
        username: username,
        text: text,
        timestamp: Date.now()
    });

    userInput.value = ''; // 清空输入框
}

// 监听云端数据库：一旦数据库有新消息，不管是你发的还是别人发的，立刻渲染到网页上
onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const currentUsername = usernameInput.value.trim() || "匿名者";
    
    // 检查发消息的人是不是“当前浏览器”里的自己，用来决定靠左还是靠右显示
    const isMe = data.username === currentUsername;

    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', isMe ? 'me' : 'others');

    // 格式化时间显示
    const timeString = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    wrapper.innerHTML = `
        <div class="meta-info">${data.username} (${timeString})</div>
        <div class="message">${data.text}</div>
    `;

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight; // 让聊天框自动滚到底部
});

// 绑定发送按钮点击事件，以及回车键发送事件
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
