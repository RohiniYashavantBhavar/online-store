let total = 0;
let cartItems = [];

// Load saved cart from localStorage
window.addEventListener('load', () => {
  const savedCart = JSON.parse(localStorage.getItem('cartItems'));
  const savedTotal = parseFloat(localStorage.getItem('cartTotal'));

  if (savedCart && savedCart.length > 0) {
    cartItems = savedCart;
    total = savedTotal || 0;

    cartItems.forEach(item => addItemToDOM(item));
    updateTotal();
  }
});

document.querySelectorAll('.product-card button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    const existingItem = cartItems.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ name, price, quantity: 1 });
    }

    updateCartDOM();
    updateTotal();
    saveCart();
  });
});

function updateCartDOM() {
  const cartList = document.getElementById('cart-items');
  cartList.innerHTML = '';

  cartItems.forEach(item => addItemToDOM(item));
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  const totalPrice = (item.price * item.quantity).toFixed(2);

  li.innerHTML = `
    ${item.name} x ${item.quantity} – $${totalPrice}
    <button class="remove-btn">❌</button>
  `;

  li.querySelector('.remove-btn').addEventListener('click', () => {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cartItems = cartItems.filter(i => i !== item);
    }

    updateCartDOM();
    updateTotal();
    saveCart();
  });

  document.getElementById('cart-items').appendChild(li);
}

function updateTotal() {
  total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  localStorage.setItem('cartTotal', total.toFixed(2));
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  alert('Thanks for your purchase!');
  cartItems = [];
  total = 0;
  updateCartDOM();
  updateTotal();
  saveCart();
});
