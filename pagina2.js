// sidebar.js - Mantenha este código separado para organização
        const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
        sideLinks.forEach(item => {
            const li = item.parentElement;
            item.addEventListener('click', () => {
                sideLinks.forEach(i => {
                    i.parentElement.classList.remove('active');
                });
                li.classList.add('active');
            });
        });

        const menuBar = document.querySelector('.content nav .bx.bx-menu');
        const sideBar = document.querySelector('.sidebar');
        if (menuBar && sideBar) {
            menuBar.addEventListener('click', () => {
                sideBar.classList.toggle('close');
            });
        }

        const searchBtn = document.querySelector('.content nav form .form-input button');
        const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
        const searchForm = document.querySelector('.content nav form');
        if (searchBtn && searchBtnIcon && searchForm) {
            searchBtn.addEventListener('click', function (e) {
                if (window.innerWidth < 576) {
                    e.preventDefault();
                    searchForm.classList.toggle('show');
                    if (searchForm.classList.contains('show')) {
                        searchBtnIcon.classList.replace('bx-search', 'bx-x');
                    } else {
                        searchBtnIcon.classList.replace('bx-x', 'bx-search');
                    }
                }
            });
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) {
                if (sideBar) sideBar.classList.add('close');
            } else {
                if (sideBar) sideBar.classList.remove('close');
            }
            if (window.innerWidth > 576 && searchBtnIcon && searchForm) {
                searchBtnIcon.classList.replace('bx-x', 'bx-search');
                searchForm.classList.remove('show');
            }
        });

        const toggler = document.getElementById('theme-toggle');
        if (toggler) {
            toggler.addEventListener('change', function () {
                if (this.checked) {
                    document.body.classList.add('dark');
                } else {
                    document.body.classList.remove('dark');
                }
            });
        }

        // Sistema de gerenciamento de amigos e chat
        document.addEventListener('DOMContentLoaded', () => {
            // Elementos do DOM
            const searchInput = document.getElementById("searchInput");
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
            
            // Estado da aplicação
            let currentFriend = null;
            let chats = JSON.parse(localStorage.getItem('friend_chats')) || {};
            let friends = JSON.parse(localStorage.getItem('friends_list')) || [];
            
            // Sistema de busca
            if (searchInput) {
                searchInput.addEventListener("keyup", () => {
                    const filter = searchInput.value.toLowerCase();
                    const tableRows = document.querySelectorAll("#friendsTable tbody tr");
                    
                    tableRows.forEach(row => {
                        const friendName = row.querySelector("td p").textContent.toLowerCase();
                        if (friendName.includes(filter)) {
                            row.style.display = "";
                        } else {
                            row.style.display = "none";
                        }
                    });
                });
            }
            
            // Inicialização
            renderFriendsList();
            
            // Event Listeners
            if (addFriendBtn) addFriendBtn.addEventListener('click', addNewFriend);
            if (closeChatBtn) closeChatBtn.addEventListener('click', closeChat);
            if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
            if (chatInput) {
                chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });
            }
            
            // Funções
            function addNewFriend() {
                const name = friendNameInput.value.trim();
                const img = friendImgInput.value.trim() || 'https://ppgquimica.propg.ufabc.edu.br/wp-content/uploads/2016/05/sem-imagem-avatar.png';
                const status = friendStatusSelect.value;
                
                if (!name) {
                    alert('Por favor, insira um nome para o amigo.');
                    return;
                }
                
                // Verificar se o amigo já existe
                if (friends.some(friend => friend.name === name)) {
                    alert('Este amigo já foi adicionado!');
                    return;
                }
                
                // Adicionar amigo à lista
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
                
                // Inicializar chat se não existir
                if (!chats[name]) {
                    chats[name] = [];
                    saveChats();
                }
                
                // Limpar formulário
                friendNameInput.value = '';
                friendImgInput.value = '';
            }
            
            function renderFriendsList() {
                if (!friendsTable) return;
                
                friendsTable.innerHTML = '';
                
                friends.forEach(friend => {
                    const row = document.createElement('tr');
                    row.dataset.friendId = friend.id;
                    
                    row.innerHTML = `
                        <td>
                            <img src="${friend.img}" alt="${friend.name}" width="40" height="40" style="border-radius: 50%;">
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
                
                // Adicionar event listeners aos botões
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
                    // Encontrar o amigo para obter o nome (para remover o chat também)
                    const friendToRemove = friends.find(f => f.id === friendId);
                    
                    // Remover da lista de amigos
                    friends = friends.filter(friend => friend.id !== friendId);
                    saveFriends();
                    
                    // Remover o chat se existir
                    if (friendToRemove && chats[friendToRemove.name]) {
                        delete chats[friendToRemove.name];
                        saveChats();
                    }
                    
                    // Fechar o chat se estiver aberto com este amigo
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
                if (!currentFriend || !chatMessages) return;
                
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
                
                // Adicionar mensagem ao histórico
                if (!chats[currentFriend]) {
                    chats[currentFriend] = [];
                }
                
                chats[currentFriend].push(message);
                saveChats();
                renderChat();
                
                // Simular resposta após um breve delay
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
