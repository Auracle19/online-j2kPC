let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let totalElement = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let searchInput = document.getElementById('searchInput');

let products = [
    { id: 1, name: 'Intel Core i3 13100', image: 'PROCESSORS/Intel Core i3 13100.png', hoverImage: 'PROCESSORS/Intel Core i3 13100 -1.avif', price: 6500, stock: 10 },
    { id: 2, name: 'Intel Core i5 13400', image: 'PROCESSORS/Intel Core i5 13400.webp', hoverImage: 'PROCESSORS/Intel Core i5 13400 -1.jpg', price: 10800, stock: 8 },
    { id: 3, name: 'Intel Core i5 13500', image: 'PROCESSORS/Intel Core i5 13500.webp', hoverImage: 'PROCESSORS/Intel Core i5 13500 -1.jpg', price: 15500, stock: 5 },
    { id: 4, name: 'AMD Ryzen 3 3200G', image: 'PROCESSORS/AMD Ryzen 3 3200G.jpg', hoverImage: 'PROCESSORS/AMD Ryzen 3 3200G -1.jpg', price: 18500, stock: 12 },
    { id: 5, name: 'AMD Ryzen 5 5600', image: 'PROCESSORS/AMD Ryzen 5 5600.webp', hoverImage: 'PROCESSORS/AMD Ryzen 5 5600 -1.jpg', price: 20000, stock: 6 },
    { id: 6, name: 'AMD Ryzen 7 5700X', image: 'PROCESSORS/AMD Ryzen 7 5700X.jpg', hoverImage: 'PROCESSORS/AMD Ryzen 7 5700X -1.jpg', price: 23000, stock: 4 }
];

let cart = [];

// Initialize the app
function initApp() {
    displayProducts(products);
    searchInput.addEventListener('input', searchProducts);
    openShopping.addEventListener('click', () => body.classList.add('active'));
    closeShopping.addEventListener('click', () => body.classList.remove('active'));
    document.getElementById('paymentMethod').addEventListener('change', togglePaymentFields);
    document.querySelector('.orderNow').addEventListener('click', handleOrder);
}

// Display products
function displayProducts(productArray) {
    list.innerHTML = '';
    productArray.forEach(product => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
        <img src="${product.image}" data-hover="${product.hoverImage}" alt="${product.name}">
        <div class="title">${product.name}</div>
        <div class="price">${product.price.toLocaleString()}</div>
        <div>Stock: ${product.stock}</div>
        <div class="d-flex justify-content-between">
            <button data-id="${product.id}" class="add-to-cart">Add To Cart</button>
            <button data-id="${product.id}" class="buy-now ms-2">Buy Now</button>
        </div>`;
    
        const buyNowButton = newDiv.querySelector('.buy-now');
        buyNowButton.addEventListener('click', () => {
            addToCart(product);  // Add the product to the cart first
            handleOrder();       // Then open the order modal
        });
    
        const img = newDiv.querySelector('img');
        img.addEventListener('mouseenter', () => changeImage(img, product.hoverImage));
        img.addEventListener('mouseleave', () => changeImage(img, product.image));

        list.appendChild(newDiv);
    });
}

// Change image on hover
function changeImage(img, src) {
    img.src = src;
}

// Add product to cart
list.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const productId = parseInt(event.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        addToCart(product);
    }
});

// Add to cart logic
function addToCart(product) {
    if (product.stock <= 0) {
        alert("This product is out of stock!");
        return;
    }

    const cartItem = cart.find(item => item.id === product.id);
    if (!cartItem) {
        cart.push({ ...product, quantity: 1 });
    } else {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert("Cannot add more than available stock!");
            return;
        }
    }

    product.stock--;
    updateCart();
}

// Update cart display
function updateCart() {
    listCard.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const newDiv = document.createElement('li');
        newDiv.innerHTML = `
            <div><img src="${item.image}" alt="${item.name}"/></div>
            <div>${item.name}</div>
            <div>${item.price.toLocaleString()}</div>
            <div>
                <button onclick="adjustQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="adjustQuantity(${item.id}, 1)">+</button>
            </div>`;
        listCard.appendChild(newDiv);
        totalPrice += item.price * item.quantity;
    });

    totalElement.innerText = `Total: ${totalPrice.toLocaleString()}`;
    quantity.innerText = cart.length;
}

// Adjust quantity of items in the cart
function adjustQuantity(id, change) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        if (change === 1 && cartItem.quantity < products.find(p => p.id === id).stock) {
            cartItem.quantity++;
        } else if (change === -1) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
            } else {
                removeFromCart(id);
                return;
            }
        }
        updateCart();
    }
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Search function
function searchProducts() {
    const searchInputValue = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchInputValue)
    );
    displayProducts(filteredProducts);
}

// Show/hide payment fields
function togglePaymentFields() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const creditCardFields = document.getElementById('creditCardFields');

    creditCardFields.style.display = paymentMethod === 'credit_card' ? 'block' : 'none';
}

// Handle order placement
function handleOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add items to your cart before ordering.");
        return;
    }

    // Populate order summary
    const orderSummary = document.getElementById('orderSummary');
    orderSummary.innerHTML = ''; // Clear previous summary
    let totalAmount = 0;

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        listItem.innerHTML = `${item.name} (x${item.quantity}) <span>₱${itemTotal.toLocaleString()}</span>`;
        orderSummary.appendChild(listItem);
    });

    document.getElementById('orderTotal').innerText = `₱${totalAmount.toLocaleString()}`;

    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    orderModal.show();

    // Attach submit order event
    document.getElementById('submitOrder').onclick = () => submitOrder(totalAmount);
}

// Submit order
function submitOrder(totalAmount) {
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    // Validate fields
    if (!customerName || !customerEmail || !customerAddress || !customerPhone || !paymentMethod) {
        alert("Please fill in all fields.");
        return;
    }

    // Prepare order data
    const orderData = {
        name: customerName,
        email: customerEmail,
        address: customerAddress,
        phone: customerPhone,
        paymentMethod: paymentMethod,
        total: totalAmount,
        items: cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity }))
    };

    // Send order data to the server
    fetch('place_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Display success or error message
        cart = []; // Clear the cart after successful order
        updateCart(); // Update cart UI
        document.getElementById('orderModal').modal('hide'); // Hide the modal
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error placing your order.');
    });
}

// Initialize the app on page load
window.onload = initApp;
