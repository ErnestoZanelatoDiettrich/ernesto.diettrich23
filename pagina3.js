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
        const cardContainer = document.getElementById("card-container");
        const cardCountElem = document.getElementById("card-count");
        const cardTotalElem = document.getElementById("card-total");
        const loader = document.getElementById("loader");
        const cartButton = document.getElementById("cart-button");
        const cartModal = document.getElementById("cart-modal");
        const overlay = document.getElementById("overlay");
        const closeCart = document.querySelector(".close-cart");
        const cartItems = document.getElementById("cart-items");
        const cartCount = document.getElementById("cart-count");
        const cartTotalPrice = document.getElementById("cart-total-price");
        const cardLimit = 99;
        const cardIncrease = 9;
        const pageCount = Math.ceil(cardLimit / cardIncrease);
        let currentPage = 1;
        let cart = [];
        const productNames = [
            "Smartphone", "Notebook", "Fone de Ouvido", "Tablet", "Smartwatch",
            "Teclado Mecânico", "Mouse Gamer", "Monitor", "Câmera", "Console",
            "Impressora", "SSD", "Memória RAM", "Placa de Vídeo", "Processador",
            "Headset", "Caixa de Som", "Webcam", "Microfone", "Roteador"
        ];
        const productCategories = [
            "Eletrônicos", "Informática", "Áudio", "Games", "Acessórios"
        ];
        const getRandomPrice = () => {
            return (Math.random() * 2000 + 20).toFixed(2);
        };
        const getRandomImage = (id) => {
            return `https://picsum.photos/300/200?random=${id}`;
        };
        const getRandomProductName = (id) => {
            const name = productNames[Math.floor(Math.random() * productNames.length)];
            const category = productCategories[Math.floor(Math.random() * productCategories.length)];
            return `${name} ${category} ${id}`;
        };
        var throttleTimer;
        const throttle = (callback, time) => {
            if (throttleTimer) return;

            throttleTimer = true;

            setTimeout(() => {
                callback();
                throttleTimer = false;
            }, time);
        };
        const createCard = (index) => {
            const card = document.createElement("div");
            card.className = "card";
            const productName = getRandomProductName(index);
            const productPrice = getRandomPrice();
            const productImage = getRandomImage(index);
            card.innerHTML = `
                <img src="${productImage}" alt="${productName}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${productName}</h3>
                    <div class="card-price">R$ ${productPrice.replace('.', ',')}</div>
                    <button class="add-to-cart" data-id="${index}" data-name="${productName}" data-price="${productPrice}" data-image="${productImage}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;
            
            cardContainer.appendChild(card);           
            const addButton = card.querySelector('.add-to-cart');
            addButton.addEventListener('click', addToCart);
        };
        const addCards = (pageIndex) => {
            currentPage = pageIndex;

            const startRange = (pageIndex - 1) * cardIncrease;
            const endRange = currentPage == pageCount ? cardLimit : pageIndex * cardIncrease;

            cardCountElem.innerHTML = endRange;

            for (let i = startRange + 1; i <= endRange; i++) {
                createCard(i);
            }
        };
        const handleInfiniteScroll = () => {
            throttle(() => {
                const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100;

                if (endOfPage) {
                    addCards(currentPage + 1);
                }

                if (currentPage === pageCount) {
                    removeInfiniteScroll();
                }
            }, 500);
        };
        const removeInfiniteScroll = () => {
            loader.remove();
            window.removeEventListener("scroll", handleInfiniteScroll);
        };
        const addToCart = (e) => {
            const button = e.target;
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            const existingItem = cart.find(item => item.id === id); 
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            updateCart();
            button.textContent = "Adicionado";
            setTimeout(() => {
                button.textContent = "Adicionar ao Carrinho";
            }, 1500);
        };
        const removeFromCart = (id) => {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        };
        const updateCart = () => {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartItems.innerHTML = '';
            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="padding: 1rem; text-align: center;">Seu carrinho está vazio</p>';
                cartTotalPrice.textContent = 'R$ 0,00';
                return;
            }
            let totalPrice = 0;
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">🗑️</button>
                `;
                cartItems.appendChild(cartItem);
                const removeButton = cartItem.querySelector('.cart-item-remove');
                removeButton.addEventListener('click', () => removeFromCart(item.id));
            });   
            cartTotalPrice.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        };
        cartButton.addEventListener('click', () => {
            cartModal.style.display = 'flex';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        closeCart.addEventListener('click', closeCartModal);
        overlay.addEventListener('click', closeCartModal);

        function closeCartModal() {
            cartModal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        window.onload = function () {
            cardTotalElem.innerHTML = cardLimit;
            addCards(currentPage);
        };

        window.addEventListener("scroll", handleInfiniteScroll);



