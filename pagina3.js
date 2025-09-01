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
    console.log();
  });
document.addEventListener("DOMContentLoaded", () => {
    const storeFeed = document.getElementById("storeFeed");
    const loading = document.getElementById("loading");

    // Produtos "base"
    const products = [
        { name: "Fone Bluetooth", price: 199.90 },
        { name: "Teclado Mecânico", price: 349.90 },
        { name: "Mouse Gamer", price: 159.90 },
        { name: "Smartwatch", price: 499.90 },
        { name: "Cadeira Gamer", price: 999.90 },
        { name: "Monitor 27''", price: 1299.90 },
        { name: "HD Externo 1TB", price: 399.90 },
        { name: "Placa de Vídeo RTX", price: 2999.90 },
    ];

    // Gerar produtos aleatórios
    function loadProducts(count = 6) {
        for (let i = 0; i < count; i++) {
            const random = products[Math.floor(Math.random() * products.length)];
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="https://picsum.photos/300?random=${Math.floor(Math.random()*1000)}">
                <h3>${random.name}</h3>
                <p>R$ ${random.price.toFixed(2).replace(".", ",")}</p>
                <button class="add-to-cart">Adicionar ao Carrinho</button>
            `;
            storeFeed.appendChild(card);
        }
    }

    // --- Scroll Infinito ---
    let loadingProducts = false;
    window.addEventListener("scroll", () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !loadingProducts) {
            loadingProducts = true;
            loading.style.display = "block";
            setTimeout(() => {
                loadProducts(6);
                loading.style.display = "none";
                loadingProducts = false;
            }, 1000);
        }
    });

    loadProducts(9); // Primeiros produtos
    const cartBtn = document.getElementById("cartBtn");
    const cartSidebar = document.getElementById("cartSidebar");
    const closeCart = document.getElementById("closeCart");
    const clearCart = document.getElementById("clearCart");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const STORAGE_KEY = "asmr_cart_v1";
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    function saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    function renderCart() {
        cartItems.innerHTML = "";
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.name} - R$ ${item.price.toFixed(2).replace(".", ",")}</span>
                <button data-index="${index}">X</button>
            `;
            cartItems.appendChild(li);
        });
        cartTotal.textContent = "Total: R$ " + total.toFixed(2).replace(".", ",");
        cartCount.textContent = cart.length;

        cartItems.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = btn.dataset.index;
                cart.splice(idx, 1);
                saveCart();
                renderCart();
            });
        });
    }

    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const card = e.target.closest(".product-card");
            const name = card.querySelector("h3").textContent;
            const price = parseFloat(card.querySelector("p").textContent.replace("R$", "").replace(",", "."));
            cart.push({ name, price });
            saveCart();
            renderCart();
        }
    });

    cartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
    closeCart.addEventListener("click", () => cartSidebar.classList.remove("open"));
    clearCart.addEventListener("click", () => {
        cart = [];
        saveCart();
        renderCart();
    });

    renderCart();
});




