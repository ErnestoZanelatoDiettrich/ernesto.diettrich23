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
    if (window.innerWidth < 768 && sideBar) {
        sideBar.classList.add('close');
    } else if (sideBar) {
        sideBar.classList.remove('close');
    }
    
    if (searchBtnIcon && searchForm && window.innerWidth > 576) {
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

// FUNÇÃO PRINCIPAL DA LOJA
function initStore() {
    const storeFeed = document.getElementById("storeFeed"); 
    if (!storeFeed) {
        console.error("Elemento storeFeed não encontrado!");
        return;
    }

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

    // Variáveis para controlar o carregamento
    let loadingProducts = false;
    let loadedProductsCount = 0;
    const maxProductsToLoad = 30;
    const productsPerLoad = 6;

    function loadProducts() {
        if (loadingProducts || loadedProductsCount >= maxProductsToLoad) return;
        
        loadingProducts = true;
        
        const productsToLoad = Math.min(productsPerLoad, maxProductsToLoad - loadedProductsCount);
        
        for (let i = 0; i < productsToLoad; i++) {
            const random = products[Math.floor(Math.random() * products.length)];
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="https://picsum.photos/300?random=${Math.floor(Math.random()*1000)}" alt="${random.name}">
                <h3>${random.name}</h3>
                <p>R$ ${random.price.toFixed(2).replace(".", ",")}</p>
                <button class="add-to-cart">Adicionar ao Carrinho</button>
            `;
            storeFeed.appendChild(card);
        }
        
        loadedProductsCount += productsToLoad;
        loadingProducts = false;
        
        if (loadedProductsCount >= maxProductsToLoad) {
            const endMessage = document.createElement("div");
            endMessage.className = "end-of-products";
            endMessage.innerHTML = "<p>Todos os produtos foram carregados!</p>";
            storeFeed.appendChild(endMessage);
        }
    }

    // Sistema de carrinho
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
        if (!cartItems || !cartTotal || !cartCount) return;
        
        cartItems.innerHTML = "";
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.name} - R$ ${item.price.toFixed(2).replace(".", ",")}</span>
                <button class="remove-from-cart" data-index="${index}">X</button>
            `;
            cartItems.appendChild(li);
        });
        
        cartTotal.textContent = "Total: R$ " + total.toFixed(2).replace(".", ",");
        cartCount.textContent = cart.length;
    }

    // Event listeners para o carrinho
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const card = e.target.closest(".product-card");
            if (card) {
                const name = card.querySelector("h3").textContent;
                const priceText = card.querySelector("p").textContent;
                const price = parseFloat(priceText.replace("R$", "").replace(",", ".").trim());
                
                cart.push({ name, price });
                saveCart();
                renderCart();
            }
        }
        
        if (e.target.classList.contains("remove-from-cart")) {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            saveCart();
            renderCart();
        }
    });

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener("click", () => {
            cartSidebar.classList.add("open");
        });
    }

    if (closeCart && cartSidebar) {
        closeCart.addEventListener("click", () => {
            cartSidebar.classList.remove("open");
        });
    }

    if (clearCart) {
        clearCart.addEventListener("click", () => {
            cart = [];
            saveCart();
            renderCart();
        });
    }

    // Scroll infinito
    let scrollTimeout;
    window.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollPosition >= documentHeight - 200 && !loadingProducts && loadedProductsCount < maxProductsToLoad) {
                loadProducts();
            }
        }, 100);
    });

    // Inicialização
    loadProducts();
    renderCart();
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", initStore);






