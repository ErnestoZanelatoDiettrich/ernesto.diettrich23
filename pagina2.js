const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const tableRows = document.querySelectorAll(".orders table tbody tr");

    if (searchInput) {
        searchInput.addEventListener("keyup", () => {
            const filtro = searchInput.value.toLowerCase();

            tableRows.forEach(row => {
                const textoLinha = row.innerText.toLowerCase();
                if (textoLinha.includes(filtro)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const toggleAddTask = document.getElementById('toggleAddTask');
    const addTaskForm = document.querySelector('.add-task-form');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const newTaskInput = document.getElementById('newTaskInput');
    const remindersDiv = document.querySelector('.reminders');
  
    if (!remindersDiv) {
      console.error('Não encontrei .reminders no DOM. Verifique o HTML.');
      return;
    }
  
    let taskList = remindersDiv.querySelector('#taskList') || remindersDiv.querySelector('.task-list');
    if (!taskList) {
      taskList = document.createElement('ul');
      taskList.id = 'taskList';
      taskList.className = 'task-list';
      remindersDiv.appendChild(taskList);
    }
  
    const STORAGE_KEY = 'asmr_tasks_v1';
  
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(tasks)) {
      tasks = [
      ];
      save();
    }
  
    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  
    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, s =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s])
      );
    }
  
    function render() {
      taskList.innerHTML = '';
      tasks.forEach((t, idx) => {
        const li = document.createElement('li');
        li.className = t.completed ? 'completed' : 'not-completed';
        li.innerHTML = `
          <div class="task-title">
            <i class='bx ${t.completed ? 'bx-check-circle' : 'bx-x-circle'} toggle-status' data-index="${idx}" style="cursor:pointer"></i>
            <p>${escapeHtml(t.text)}</p>
          </div>
          <i class='bx bx-trash remove-task' data-index="${idx}" style="cursor:pointer" title="Remover"></i>
        `;
        taskList.appendChild(li);
      });
    }
  

    if (toggleAddTask) {
      toggleAddTask.addEventListener('click', () => {
        addTaskForm.style.display = addTaskForm.style.display === 'none' ? 'block' : 'none';
        if (addTaskForm.style.display === 'block' && newTaskInput) newTaskInput.focus();
      });
    }
  
    function addTask() {
      const txt = newTaskInput.value.trim();
      if (!txt) return;
      tasks.push({ text: txt, completed: false });
      save();
      render();
      newTaskInput.value = '';
      addTaskForm.style.display = 'none';
    }
  
    if (addTaskBtn) addTaskBtn.addEventListener('click', addTask);
  
    if (newTaskInput) {
      newTaskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addTask();
        }
      });
    }
  
    taskList.addEventListener('click', (e) => {
      const idx = Number(e.target.dataset.index);
      if (e.target.classList.contains('remove-task')) {
        tasks.splice(idx, 1);
        save();
        render();
      } else if (e.target.classList.contains('toggle-status')) {
        tasks[idx].completed = !tasks[idx].completed;
        save();
        render();
      }
    });
  
    render();
  });
document.addEventListener('DOMContentLoaded', () => {
    const addFriendBtn = document.getElementById('addFriendBtn');
    const friendNameInput = document.getElementById('friendName');
    const friendImgInput = document.getElementById('friendImg');
    const friendStatusSelect = document.getElementById('friendStatus');
    const friendsTable = document.querySelector('#friendsTable tbody');
    const chatPopup = document.getElementById('chatPopup');
    const chatFriendName = document.getElementById('chatFriendName');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChat');
    const closeChatBtn = document.getElementById('closeChat');
    let currentFriend = null;
    let chats = JSON.parse(localStorage.getItem('friend_chats')) || {};
    let friends = JSON.parse(localStorage.getItem('friends_list')) || [];
    renderFriendsList();
    addFriendBtn.addEventListener('click', addNewFriend);
    closeChatBtn.addEventListener('click', closeChat);
    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    }); 
    function addNewFriend() {
        const name = friendNameInput.value.trim();
        const img = friendImgInput.value.trim() || 'https://ppgquimica.propg.ufabc.edu.br/wp-content/uploads/2016/05/sem-imagem-avatar.png';
        const status = friendStatusSelect.value;
        
        if (!name) {
            alert('Por favor, insira um nome para o amigo.');
            return;
        }     
        if (friends.some(friend => friend.name === name)) {
            alert('Este amigo já foi adicionado!');
            return;
        }     
        const newFriend = {
            id: Date.now(),
            name,
            img,
            status,
            lastOnline: 'Agora'
        };
        
        friends.push(newFriend);
        saveFriends();
        renderFriendsList();
        if (!chats[name]) {
            chats[name] = [];
            saveChats();
        }
        friendNameInput.value = '';
        friendImgInput.value = '';
    }
    
    function renderFriendsList() {
        friendsTable.innerHTML = '';
        
        friends.forEach(friend => {
            const row = document.createElement('tr');
            row.dataset.friendId = friend.id;
            
            row.innerHTML = `
                <td>
                    <img src="${friend.img}" alt="${friend.name}">
                    <p>${friend.name}</p>
                </td>
                <td>${friend.lastOnline}</td>
                <td><span class="status ${friend.status === 'Online' ? 'completed' : 'process'}">${friend.status}</span></td>
                <td>
                    <button class="chat-btn" data-friend="${friend.name}"><i class='bx bx-message'></i></button>
                    <button class="remove-btn" data-friend-id="${friend.id}"><i class='bx bx-trash'></i></button>
                </td>
            `;
            
            friendsTable.appendChild(row);
        });  
        document.querySelectorAll('.chat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const friendName = e.currentTarget.dataset.friend;
                openChat(friendName);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const friendId = parseInt(e.currentTarget.dataset.friendId);
                removeFriend(friendId);
            });
        });
    }
   
    function removeFriend(friendId) {
        if (confirm('Tem certeza que deseja remover este amigo?')) {
            const friendToRemove = friends.find(f => f.id === friendId);
            
            friends = friends.filter(friend => friend.id !== friendId);
            saveFriends();          
            if (friendToRemove && chats[friendToRemove.name]) {
                delete chats[friendToRemove.name];
                saveChats();
            }
            if (currentFriend === friendToRemove.name) {
                closeChat();
            }
            
            renderFriendsList();
        }
    }
    
    function openChat(friendName) {
        currentFriend = friendName;
        chatFriendName.textContent = friendName;
        renderChat();
        chatPopup.style.display = 'flex';
        chatInput.focus();
    }
    
    function closeChat() {
        chatPopup.style.display = 'none';
        currentFriend = null;
        chatInput.value = '';
    }
    
    function renderChat() {
        if (!currentFriend) return;
        
        chatMessages.innerHTML = '';
        const messages = chats[currentFriend] || [];
        
        messages.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.classList.add('message', msg.sender);
            messageEl.innerHTML = `
                <div class="message-content">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            `;
            chatMessages.appendChild(messageEl);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function sendMessage() {
        if (!currentFriend || !chatInput.value.trim()) return;
        
        const message = {
            text: chatInput.value.trim(),
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        if (!chats[currentFriend]) {
            chats[currentFriend] = [];
        }
        
        chats[currentFriend].push(message);
        saveChats();
        renderChat();    
        setTimeout(() => {
            const response = {
                text: getRandomResponse(),
                sender: 'friend',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            chats[currentFriend].push(response);
            saveChats();
            renderChat();
        }, 1000);
        
        chatInput.value = '';
    }
    
    function getRandomResponse() {
        const responses = [
            "Oi! Salve mano?",
            "kkk ta viajando?!",
            "Faz sentido!",
            "Opa to ocupado, deixe recado.",
            "Hm interessante!",
            "Bora sair fim de semana?",
            "Valeu ai mano!"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    function saveFriends() {
        localStorage.setItem('friends_list', JSON.stringify(friends));
    }
    
    function saveChats() {
        localStorage.setItem('friend_chats', JSON.stringify(chats));
    }
});





