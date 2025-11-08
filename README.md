# Frontend Mentor - Product list with cart solution

This is a solution to the [Product list with cart challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-list-with-cart-5MmqLVAp_d). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Add items to the cart and remove them
- Increase/decrease the number of items in the cart
- See an order confirmation modal when they click "Confirm Order"
- Reset their selections when they click "Start New Order"
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Links

- Solution URL: [Solution URL](https://github.com/noob-coder6/Product-list-with-cart.git)
- Live Site URL: [Live site URL](https://noob-coder6.github.io/Product-list-with-cart/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- CSS Grid and Flexbox
- Vanilla JavaScript
- Mobile-first workflow
- Dynamic content generation with JavaScript

### What I learned

This project helped me understand how to build a functional shopping cart application using vanilla JavaScript. Key learnings include:

**Working with data attributes for element identification:**
```js
productElement.dataset.name = product.name;
const productName = productElement.dataset.name;
```

**Using array methods for cart management:**
```js
// Calculate total with reduce
const orderTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

// Filter items to remove from cart
cart = cart.filter(item => item.name !== productName);
```

**Event delegation for dynamic content:**
```js
productListContainer.addEventListener('click', (e) => {
    const productElement = e.target.closest('.product');
    if (productElement) {
        const productName = productElement.dataset.name;
        // Handle click
    }
});
```

**Dynamic HTML generation:**
```js
products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.innerHTML = `
        <div class="product__image-wrapper">
            <img src="${product.image.desktop}" alt="${product.name}">
            <!-- More content -->
        </div>
    `;
    productListContainer.appendChild(productElement);
});
```

### Continued development

Areas I want to focus on in future projects:

- Adding localStorage to persist cart data between sessions
- Implementing more advanced animations and transitions
- Exploring state management patterns for larger applications
- Adding form validation for checkout process
- Making the application more accessible with ARIA labels

## Author

- Frontend Mentor - [@noob-coder6](https://www.frontendmentor.io/profile/noob-coder6)