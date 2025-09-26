// Data: Array of products
const products = [
    {
        id: 1,
        title: "Ugly Vase",
        description: "A beautifully broken vase with character",
        price: 100,
        image: "https://via.placeholder.com/300x300?text=Ugly+Vase"
    },
    {
        id: 2,
        title: "Crooked Painting",
        description: "A painting that didn't quite turn out as planned",
        price: 75,
        image: "https://via.placeholder.com/300x300?text=Crooked+Painting"
    },
    {
        id: 3,
        title: "Mismatched Mugs",
        description: "A set of mugs that definitely don't match",
        price: 45,
        image: "https://via.placeholder.com/300x300?text=Mismatched+Mugs"
    },
    {
        id: 4,
        title: "Wobbly Table",
        description: "Adds a unique rocking motion to your dining experience",
        price: 120,
        image: "https://via.placeholder.com/300x300?text=Wobbly+Table"
    },
    {
        id: 5,
        title: "Faded Rug",
        description: "Once vibrant, now beautifully muted",
        price: 85,
        image: "https://via.placeholder.com/300x300?text=Faded+Rug"
    },
    {
        id: 6,
        title: "Chipped Teapot",
        description: "Adds rustic charm to your tea parties",
        price: 60,
        image: "https://via.placeholder.com/300x300?text=Chipped+Teapot"
    }
];

// Cart state
let cart = [];
// Favorites state
let favorites = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    loadCartFromStorage();
    loadFavoritesFromStorage();
    updateCartUI();
    updateFavUI();
    
    // Event listener for checkout form submission
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });
});

// Render products to the page
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const isFavorited = favorites.some(fav => fav.id === product.id);
        const favoriteClass = isFavorited ? 'active' : '';
        const favoriteSymbol = isFavorited ? '♥' : '♡';
        
        const productCard = document.createElement('li');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="pr-image" style="background-image: url('${product.image}')"></div>
            <div class="pr-info">
                <h3 class="title">${product.title}</h3>
                <p class="description">${product.description}</p>
                <p class="price">$${product.price}</p>
                <button class="add-to-fav-button ${favoriteClass}" data-id="${product.id}">${favoriteSymbol}</button>
                <button class="add-to-cart-button" data-id="${product.id}">Add to cart</button>
            </div>
        `;
        productList.appendChild(productCard);
    });
    
    // Add event listeners to "Add to cart" buttons
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    // Add event listeners to "Add to favorites" buttons
    document.querySelectorAll('.add-to-fav-button').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            toggleFavorite(productId);
        });
    });
}

// Favorites functions
function toggleFavorite(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = favorites.findIndex(fav => fav.id === productId);
    const favButton = document.querySelector(`.add-to-fav-button[data-id="${productId}"]`);
    
    if (existingIndex !== -1) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        favButton.innerHTML = '♡';
        favButton.classList.remove('active');
    } else {
        // Add to favorites
        favorites.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            description: product.description
        });
        favButton.innerHTML = '♥';
        favButton.classList.add('active');
    }
    
    saveFavoritesToStorage();
    updateFavUI();
    
    // Provide visual feedback
    const originalBackground = favButton.style.backgroundColor;
    favButton.style.backgroundColor = '#ff6b6b';
    favButton.style.color = 'white';
    
    setTimeout(() => {
        favButton.style.backgroundColor = originalBackground;
        if (existingIndex !== -1) {
            favButton.style.color = '';
        }
    }, 300);
}

function removeFromFavorites(productId) {
    favorites = favorites.filter(fav => fav.id !== productId);
    saveFavoritesToStorage();
    updateFavUI();
    
    // Update the favorite button in the product list
    const favButton = document.querySelector(`.add-to-fav-button[data-id="${productId}"]`);
    if (favButton) {
        favButton.innerHTML = '♡';
        favButton.classList.remove('active');
    }
}

function moveFavoriteToCart(productId) {
    addToCart(productId);
    
    // Optional: remove from favorites after adding to cart
    // removeFromFavorites(productId);
}

function saveFavoritesToStorage() {
    localStorage.setItem('uglyThingsFavorites', JSON.stringify(favorites));
}

function loadFavoritesFromStorage() {
    const savedFavorites = localStorage.getItem('uglyThingsFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

function updateFavUI() {
    const favCount = document.getElementById('fav-count');
    const favItems = document.getElementById('fav-items');
    
    // Update favorites count
    favCount.textContent = favorites.length;
    
    // Update favorites items display
    if (favorites.length === 0) {
        favItems.innerHTML = '<div class="empty-state"><p>You haven\'t added any items to favorites yet.</p></div>';
        return;
    }
    
    favItems.innerHTML = '';
    favorites.forEach(item => {
        const favItemElement = document.createElement('div');
        favItemElement.className = 'fav-item';
        favItemElement.innerHTML = `
            <div class="fav-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price}</p>
                <p class="description">${item.description}</p>
            </div>
            <div class="fav-item-controls">
                <button class="move-to-cart-btn" onclick="moveFavoriteToCart(${item.id})">Add to Cart</button>
                <button class="remove-fav-btn" onclick="removeFromFavorites(${item.id})">Remove</button>
            </div>
        `;
        favItems.appendChild(favItemElement);
    });
}

// Cart functions (остаются без изменений, но добавляем вызов updateFavUI где нужно)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    
    // Provide visual feedback
    const button = document.querySelector(`.add-to-cart-button[data-id="${productId}"]`);
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.backgroundColor = '#3aa35c';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        updateCartUI();
    }
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function saveCartToStorage() {
    localStorage.setItem('uglyThingsCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('uglyThingsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');
    const cartItems = document.getElementById('cart-items');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update total price
    totalPrice.textContent = calculateTotal().toFixed(2);
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-state"><p>Your cart is empty.</p></div>';
        return;
    }
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItemElement);
    });
}

// Modal functions (добавляем функцию для избранного)
function toggleFavModal() {
    const modal = document.getElementById('fav-modal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
    }
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
    }
}

function openCheckoutForm() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckoutForm() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function closeOrderSuccessModal() {
    document.getElementById('order-success-modal').style.display = 'none';
}

// Order placement
function placeOrder() {
    // In a real application, you would send the order data to a server here
    document.getElementById('checkout-modal').style.display = 'none';
    
    // Clear the cart
    cart = [];
    saveCartToStorage();
    updateCartUI();
    
    // Reset the form
    document.getElementById('checkout-form').reset();
    
    // Show success message
    document.getElementById('order-success-modal').style.display = 'block';
}

// Navigation functions (from your original code, slightly modified)
function changeContent(page) {
    const startContent = document.getElementById('startContent');
    const contentDiv = document.getElementById('content');
    
    startContent.style.display = 'none';
    contentDiv.style.display = 'block';
    
    switch (page) {
        case 'store':
            contentDiv.innerHTML = `
                <h2>About Our Store</h2>
                <p>Welcome to the Ugly Things Store! We believe that beauty is in the eye of the beholder, and sometimes the most interesting items are those that are a little bit imperfect.</p>
                <p>Our mission is to find homes for these unique pieces that others might overlook. After all, ugly doesn't mean unwanted!</p>
            `;
            break;
        case 'new':
            contentDiv.innerHTML = `
                <h2>New Arrivals</h2>
                <p>Check back soon for new ugly additions to our collection!</p>
            `;
            break;
        case 'catalog':
            goBackToStart();
            return;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}

function goBackToStart() {
    const startContent = document.getElementById('startContent');
    const contentDiv = document.getElementById('content');
    
    contentDiv.style.display = 'none';
    startContent.style.display = 'block';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}
