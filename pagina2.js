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
        { text: 'Reunião', completed: true },
        { text: 'Encontro com o ditador', completed: true },
        { text: 'Jogar brawl stars', completed: false }
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
// pagina2.js
const addFriendBtn = document.getElementById("addFriendBtn");
addFriendBtn.addEventListener("click", () => {
    let name = document.getElementById("friendName").value;
    let img = document.getElementById("friendImg").value || "images/logo.png";
    let status = document.getElementById("friendStatus").value;

    if (name.trim() !== "") {
        let tbody = document.querySelector(".orders tbody");
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <img src="${img}">
                <p>${name}</p>
            </td>
            <td>Agora</td>
            <td><span class="status ${status === "Online" ? "completed" : "process"}">${status}</span></td>
        `;

        tbody.appendChild(row);

        document.getElementById("friendName").value = "";
        document.getElementById("friendImg").value = "";
    }
});
function addRemoveButtons() {
    document.querySelectorAll(".orders tbody tr").forEach(row => {
        if (!row.querySelector(".remove-btn")) {
            let td = document.createElement("td");
            td.innerHTML = `<button class="remove-btn">Remover</button>`;
            row.appendChild(td);

            td.querySelector(".remove-btn").addEventListener("click", () => {
                row.remove();
            });
        }
    });
}

addRemoveButtons();
setInterval(() => {
    let rows = document.querySelectorAll(".orders tbody tr");
    rows.forEach(row => {
        let statusEl = row.querySelector(".status");
        if (Math.random() > 0.5) {
            statusEl.textContent = "Online";
            statusEl.className = "status completed";
            row.querySelector("td:nth-child(2)").textContent = "Agora";
        } else {
            statusEl.textContent = "Offline";
            statusEl.className = "status process";
            row.querySelector("td:nth-child(2)").textContent = "Há pouco";
        }
    });
}, 5000);
document.querySelectorAll(".orders tbody tr").forEach(row => {
    row.addEventListener("click", () => {
        let name = row.querySelector("p").textContent;
        document.getElementById("chatFriendName").textContent = name;
        document.getElementById("chatPopup").style.display = "block";
    });
});

document.getElementById("closeChat").addEventListener("click", () => {
    document.getElementById("chatPopup").style.display = "none";
});

document.getElementById("sendChat").addEventListener("click", () => {
    let msgBox = document.getElementById("chatMessages");
    let msg = document.getElementById("chatInput").value;
    if (msg.trim() !== "") {
        let p = document.createElement("p");
        p.textContent = "Você: " + msg;
        msgBox.appendChild(p);
        document.getElementById("chatInput").value = "";
    }
});
// Seletores do chat
const chatPopup = document.getElementById("chatPopup");
const chatFriendName = document.getElementById("chatFriendName");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");
const closeChat = document.getElementById("closeChat");

let currentFriend = "";

// Função para abrir chat de um amigo
function attachChatEvent(row) {
    row.addEventListener("click", () => {
        currentFriend = row.querySelector("p").textContent;
        chatFriendName.textContent = currentFriend;
        chatMessages.innerHTML = ""; // limpa histórico
        chatPopup.style.display = "flex";
    });
}

// Fechar chat
closeChat.addEventListener("click", () => {
    chatPopup.style.display = "none";
});

// Enviar mensagem
sendChat.addEventListener("click", () => {
    let msg = chatInput.value.trim();
    if (msg !== "") {
        let p = document.createElement("p");
        p.classList.add("me");
        p.textContent = "Você: " + msg;
        chatMessages.appendChild(p);
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulação de resposta do amigo
        setTimeout(() => {
            let reply = document.createElement("p");
            reply.classList.add("friend");
            reply.textContent = currentFriend + ": haha boa!";
            chatMessages.appendChild(reply);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
});

// Ativar chat para amigos existentes
document.querySelectorAll("#friendsTable tr").forEach(attachChatEvent);

// ⚡ Integração com "Adicionar amigo"
addFriendBtn.addEventListener("click", () => {
    let name = friendName.value.trim();
    let img = friendImg.value.trim() || "https://i.pravatar.cc/80";
    let status = friendStatus.value;

    if (name !== "") {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${img}">
                <p>${name}</p>
            </td>
            <td>Agora</td>
            <td><span class="status ${status === "Online" ? "completed" : "process"}">${status}</span></td>
            <td><button class="remove-btn">Remover</button></td>
        `;
        friendsTable.appendChild(row);

        // Botão remover
        addRemoveEvent(row.querySelector(".remove-btn"));
        // Chat
        attachChatEvent(row);

        // Limpar campos
        friendName.value = "";
        friendImg.value = "";
    }
});



