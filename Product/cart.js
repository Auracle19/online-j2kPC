let listCard = document.querySelector('.listCard');
let total = document.querySelector('.total');
let listCards = JSON.parse(localStorage.getItem('cart')) || [];

// Reload the shopping cart
function reloadCart() {
    listCard.innerHTML = '';
    let totalPrice = 0;

    listCards.forEach(item => {
        totalPrice += item.price * item.quantity;

        let newDiv = document.createElement('li');
        newDiv.innerHTML = `
            <div>${item.name} - ${item.price.toLocaleString()} x ${item.quantity}</div>
            <button onclick="removeFromCart(${item.id})">Remove</button>`;
        listCard.appendChild(newDiv);
    });

    total.innerText = `Total: ${totalPrice.toLocaleString()}`;
}

// Remove item from cart
function removeFromCart(id) {
    listCards = listCards.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(listCards));
    reloadCart();
}

// Place Order functionality
document.querySelector('.orderNow').addEventListener('click', () => {
    if (listCards.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // Here you can add order submission logic (e.g., displaying a modal or redirecting to an order form)
});

// Initialize the cart
reloadCart();
