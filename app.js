document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.querySelector('.products__list');
    const cartQuantityElement = document.querySelector('.cart__quantity');
    const cartItemsContainer = document.querySelector('.cart__items');
    const productsTitle = document.querySelector('.products__title');
    const cartSummaryContainer = document.querySelector('.cart__summary');
    const cartEmptyElement = document.querySelector('.cart__empty');
    const cartContent = document.querySelector('.cart__content');
    const modal = document.querySelector('.modal');
    const modalSummaryContainer = document.querySelector('.modal__summary');
    const newOrderBtn = document.querySelector('.modal__new-order-btn');

    let products = [];
    let cart = [];

    // Fetch products and initialize
    const init = async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Network response was not ok');
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Failed to fetch products:', error);
            productListContainer.innerHTML = '<p>Failed to load products. Please try again later.</p>';
        }
    };

    const renderProducts = () => {
        productListContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.dataset.name = product.name;

            productElement.innerHTML = `
                <div class="product__image-wrapper">
                    <img src="${product.image.desktop}" alt="${product.name}" class="product__image">
                    <div class="product__button-container">
                        <button class="product__add-to-cart-btn">
                            <img src="./assets/images/icon-add-to-cart.svg" alt="">
                            Add to Cart
                        </button>
                    </div>
                </div>
                <div class="product__info">
                    <p class="product__category">${product.category}</p>
                    <p class="product__name">${product.name}</p>
                    <p class="product__price">$${product.price.toFixed(2)}</p>
                </div>
            `;
            productListContainer.appendChild(productElement);
        });
    };

    const updateProductButton = (productName) => {
        const productElement = productListContainer.querySelector(`.product[data-name="${productName}"]`);
        if (!productElement) return;

        const buttonContainer = productElement.querySelector('.product__button-container');
        const productInCart = cart.find(item => item.name === productName);

        if (productInCart) {
            productElement.classList.add('in-cart');
            buttonContainer.innerHTML = `
                <div class="product__quantity-control">
                    <button class="product__quantity-btn" data-action="decrease" aria-label="Decrease quantity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
                    </button>
                    <span class="product__quantity-value">${productInCart.quantity}</span>
                    <button class="product__quantity-btn" data-action="increase" aria-label="Increase quantity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
                    </button>
                </div>
            `;
        } else {
            productElement.classList.remove('in-cart');
            buttonContainer.innerHTML = `
                <button class="product__add-to-cart-btn">
                    <img src="./assets/images/icon-add-to-cart.svg" alt="">
                    Add to Cart
                </button>
            `;
        }
    };

    const updateCart = () => {
        cartItemsContainer.innerHTML = '';
        cartSummaryContainer.innerHTML = '';

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartQuantityElement.textContent = totalItems;

        if (cart.length === 0) {
            cartEmptyElement.hidden = false;
            cartItemsContainer.hidden = true;
            cartSummaryContainer.hidden = true;
            const confirmBtn = cartContent.querySelector('.cart__confirm-btn');
            if (confirmBtn) confirmBtn.remove();
        } else {
            cartEmptyElement.hidden = true;
            cartItemsContainer.hidden = false;
            cartSummaryContainer.hidden = false;

            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart__item');
                cartItemElement.innerHTML = `
                    <div class="cart__item-info">
                        <p class="cart__item-name">${item.name}</p>
                        <p>
                            <span class="cart__item-quantity">${item.quantity}x</span>
                            <span class="cart__item-price">@ $${item.price.toFixed(2)}</span>
                            <span class="cart__item-total">$${(item.quantity * item.price).toFixed(2)}</span>
                        </p>
                    </div>
                    <button class="cart__item-remove-btn" data-name="${item.name}" aria-label="Remove ${item.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#B1A19D" d="M8.375 9.375 5 6 1.625 9.375.625 8.375 4 5 .625 1.625 1.625.625 5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });

            const orderTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
            cartSummaryContainer.innerHTML = `
                <div class="cart__total">
                    <span class="cart__total-label">Order Total</span>
                    <span class="cart__total-price">$${orderTotal.toFixed(2)}</span>
                </div>
            `;

            if (!cartContent.querySelector('.cart__confirm-btn')) {
                const confirmBtn = document.createElement('button');
                confirmBtn.classList.add('cart__confirm-btn');
                confirmBtn.textContent = 'Confirm Order';
                cartContent.appendChild(confirmBtn);
            }
        }
    };

    const addToCart = (productName) => {
        const product = products.find(p => p.name === productName);
        const cartItem = cart.find(item => item.name === productName);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateProductButton(productName);
        updateCart();
    };

    const removeFromCart = (productName) => {
        cart = cart.filter(item => item.name !== productName);
        updateCart();
    };


    const updateQuantity = (productName, action) => {
        const cartItem = cart.find(item => item.name === productName);
        if (cartItem) {
            if (action === 'increase') {
                cartItem.quantity++;
            } else if (action === 'decrease') {
                cartItem.quantity--;
                if (cartItem.quantity === 0) {
                    removeFromCart(productName);
                    updateProductButton(productName);
                    return;
                }
            }
            updateCart();
            updateProductButton(productName);
        }
    };

    const showConfirmationModal = () => {
        modalSummaryContainer.innerHTML = '';
        const orderTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

        cart.forEach(item => {
            const modalItemElement = document.createElement('div');
            modalItemElement.classList.add('cart__item');
            modalItemElement.innerHTML = `
                <img src="${item.image.thumbnail}" alt="${item.name}" class="cart__item-img">
                <div class="cart__item-info">
                    <p class="cart__item-name">${item.name}</p>
                    <p>
                        <span class="cart__item-quantity">${item.quantity}x</span>
                        <span class="cart__item-price">@ $${item.price.toFixed(2)}</span>
                    </p>
                </div>
                <span class="cart__item-total">$${(item.quantity * item.price).toFixed(2)}</span>
            `;
            modalSummaryContainer.appendChild(modalItemElement);
        });

        const totalElement = document.createElement('div');
        totalElement.classList.add('cart__total');
        totalElement.innerHTML = `
            <span class="cart__total-label">Order Total</span>
            <span class="cart__total-price">$${orderTotal.toFixed(2)}</span>
        `;
        modalSummaryContainer.appendChild(totalElement);

        modal.hidden = false;
    };

    const resetOrder = () => {
        cart = [];
        modal.hidden = true;
        renderProducts(); // This will reset all buttons to "Add to Cart"
        updateCart();
        productsTitle.focus(); // For accessibility, return focus to the top of the products list
    };

    // Event Listeners
    productListContainer.addEventListener('click', (e) => {
        const productElement = e.target.closest('.product');
        if (!productElement) return;

        const productName = productElement.dataset.name;

        if (e.target.closest('.product__add-to-cart-btn')) {
            addToCart(productName);
        }

        const quantityBtn = e.target.closest('.product__quantity-btn');
        if (quantityBtn) {
            const action = e.target.closest('.product__quantity-btn').dataset.action;
            updateQuantity(productName, action);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.cart__item-remove-btn');
        if (removeBtn) {
            const productName = removeBtn.dataset.name;
            removeFromCart(productName);
            updateProductButton(productName);
        }
    });

    cartContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart__confirm-btn')) {
            showConfirmationModal();
        }
    });

    newOrderBtn.addEventListener('click', resetOrder);

    // Close modal if clicked outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            resetOrder();
        }
    });

    init();
});