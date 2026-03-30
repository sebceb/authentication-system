import { fetchCategories, fetchProducts } from './api.js';
import { Storage } from './storage.js';
import { renderProducts, renderCart } from './ui.js';

const state = {
    products: [],
    cart: [], // Empty initially; fetched once user is confirmed
    filters: { categoryId: null, minPrice: null, maxPrice: null }
};

// Start the app when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

/**
 * Initializes the application on load.
 * Checks the current authentication state and routes the user 
 * either to the login page or the main store page.
 */
async function init() {
    const currentUser = Storage.getCurrentUser();
    const authView = document.getElementById('auth-view');
    
    if (authView) {
        // We are on login.html
        if (currentUser) return window.location.href = 'index.html';
        setupAuthListeners();
    } else {
        // We are on index.html
        if (!currentUser) return window.location.href = 'login.html';
        state.cart = Storage.getCart(); // Fetch specific user's cart
        setupListeners();
        await enterStore(currentUser);
    }
}

/**
 * Binds event listeners to the authentication buttons 
 * (Sign Up, Sign In, and Join as Guest) and handles their logic.
 */
function setupAuthListeners() {
    const toggleAuthMode = document.getElementById('toggle-auth-mode');
    const togglePrefix = document.getElementById('toggle-prefix');
    const signupContainer = document.getElementById('signup-container');
    const signinContainer = document.getElementById('signin-container');

    if (toggleAuthMode && togglePrefix && signupContainer && signinContainer) {
        // Default to Sign In mode
        signupContainer.style.display = 'none';
        signinContainer.style.display = 'block';

        let isSignIn = true; // Track current view state

        toggleAuthMode.addEventListener('click', () => {
            isSignIn = !isSignIn; // Flip the state
            
            signupContainer.style.display = isSignIn ? 'none' : 'block';
            signinContainer.style.display = isSignIn ? 'block' : 'none';
            
            // Update the text dynamically
            togglePrefix.textContent = isSignIn ? 'New to THeSt0re?' : 'Welcome back to THeSt0re.';
            toggleAuthMode.textContent = isSignIn ? 'Sign up now.' : 'Sign in now.';
        });
    }

    document.getElementById('signup-btn')?.addEventListener('click', () => {
        const email = document.getElementById('signup-email').value.trim();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        
        if (!email || !username || !password) return alert("Please fill all sign up fields");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return alert("Please enter a valid email address.");

        const users = Storage.getUsers();
        if (users.find(u => u.username === username)) return alert("Username already exists");

        const newUser = { email, username, password, isGuest: false };
        users.push(newUser);
        Storage.saveUsers(users);
        Storage.setCurrentUser(newUser);
        window.location.href = 'index.html';
    });

    document.getElementById('signin-btn')?.addEventListener('click', () => {
        const username = document.getElementById('signin-username').value.trim();
        const password = document.getElementById('signin-password').value.trim();
        
        if (!username || !password) return alert("Please fill all sign in fields");

        const user = Storage.getUsers().find(u => u.username === username && u.password === password);
        
        if (user) {
            Storage.setCurrentUser(user);
            window.location.href = 'index.html';
        } else {
            alert("Invalid username or password");
        }
    });

    document.getElementById('guest-btn')?.addEventListener('click', () => {
        const guestUser = { username: 'Guest', email: 'guest@example.com', isGuest: true };
        Storage.setCurrentUser(guestUser);
        window.location.href = 'index.html';
    });
}

/**
 * Transitions the application into the main store view for an authenticated user.
 * Updates the UI with the user's details, fetches categories, and loads products.
 * @param {Object} user - The currently logged-in user object.
 */
async function enterStore(user) {
    const displayUser = document.getElementById('display-user');
    if (displayUser) displayUser.textContent = user.username;

    // Hide the cart completely if the user is a guest
    if (user.isGuest) {
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) cartBtn.style.display = 'none';
    }

    // 1. Fetch categories
    const categories = await fetchCategories();

    // DEBUG: Log the fetched categories to see what the API provides.
    console.log('All available categories from API:', categories);
    console.log(`Total categories found: ${categories.length}`);
    
    // 2. Fetch the most stable category (usually the first one, e.g., Clothes)
    const selectedCategory = categories[4];
    
    // Set the filter in the global state
    state.filters.categoryId = selectedCategory ? selectedCategory.id : null;

    // Verify in the console
    console.log(`Targeting Category: ${selectedCategory ? selectedCategory.name : 'All'} (ID: ${state.filters.categoryId})`);

    // Update UI to visually prove we are only displaying one category
    const titleEl = document.getElementById('current-category-title');
    if (titleEl && selectedCategory) {
        titleEl.textContent = `Displaying Category: ${selectedCategory.name}`;
    }

    // 3. Load products and sync UI
    await refreshProducts();
    syncCart();
}

/**
 * Fetches products from the API based on current filters (category, price limits).
 * Filters out items with invalid images and restricts the output to 50 products.
 * Triggers the UI to re-render the product grid.
 */
async function refreshProducts() {
    const allProducts = await fetchProducts(state.filters);
    
    state.products = allProducts.filter(product => {
        if (!product.images || product.images.length === 0) return false;
        const imgString = product.images[0].toLowerCase();

        const hasValidImage = !imgString.includes('600x400') && 
                              !imgString.includes('200x200') && 
                              !imgString.includes('placehold');

        return hasValidImage;
    });

    // Keep a maximum of 50 products for UI consistency
    state.products = state.products.slice(0, 50);

    console.log(`Confirmed: ${state.products.length} products found.`);
    renderProducts(state.products, 'product-grid');
}

/**
 * Sets up event listeners for the main store interface.
 * Includes listeners for price filters, logout, adding items to the cart,
 * cart controls (increase, decrease, remove), and the checkout button.
 */
function setupListeners() {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        Storage.logout();
        window.location.href = 'login.html';
    });

    const minInput = document.getElementById('min-price');
    const maxInput = document.getElementById('max-price');
    const productGrid = document.getElementById('product-grid');
    const checkoutBtn = document.getElementById('checkout-btn'); // Make sure this matches your HTML ID
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');

    [minInput, maxInput].forEach(input => {
        if (input) {
            input.addEventListener('change', () => {
                state.filters.minPrice = minInput?.value ? Number(minInput.value) : null;
                state.filters.maxPrice = maxInput?.value ? Number(maxInput.value) : null;
                refreshProducts();
            });
        }
    });

    // Event Delegation: Listen for clicks on the parent grid
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-btn')) {
                const productId = Number(e.target.dataset.id);
                addToCart(productId);
            }
        });
    }

    const cartItemsContainer = document.getElementById('cart-items');

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            
            if (e.target.classList.contains('qty-btn')) {
                const action = e.target.dataset.action;
                updateQuantity(id, action);
            }

            if (e.target.classList.contains('remove-btn')) {
                removeFromCart(id);
            }
        });
    }

    // Toggle Cart Modal
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.toggle('hidden');
        });
    }

    // Bind the complete purchase / checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

/**
 * Adds a product to the cart or increments its quantity if it's already there.
 * Blocks guest users from adding items and shows an alert.
 * @param {number} productId - The ID of the product being added.
 */
function addToCart(productId) {
    const currentUser = Storage.getCurrentUser();
    if (currentUser && currentUser.isGuest) {
        alert("Guests cannot add items to the cart. Please log out and sign up to shop.");
        return;
    }

    // Find product in state
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    // Check if item already exists in cart
    const existingItem = state.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: 1
        });
    }

    // Keep state, localStorage, and UI in sync
    syncCart();
}

/**
 * Updates the quantity of an existing item in the cart.
 * @param {number} productId - The ID of the product to update.
 * @param {string} action - The action to perform ('inc' for increase, 'dec' for decrease).
 */
function updateQuantity(productId, action) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    if (action === 'inc') {
        item.quantity += 1;
    } else if (action === 'dec' && item.quantity > 1) {
        item.quantity -= 1;
    }

    syncCart();
}

/**
 * Completely removes a specific product from the cart.
 * @param {number} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    syncCart();
}

/**
 * Helper function to synchronize the global cart state with local storage
 * and update the UI (cart item list, total price, and cart notification badge).
 */
function syncCart() {
    Storage.saveCart(state.cart);
    renderCart(state.cart, 'cart-items', 'cart-total');
    
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        countSpan.textContent = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    }
}

/**
 * Generates the payload object required for processing a checkout.
 * @returns {Object} The formatted checkout payload including user details, cart contents, total, and date.
 */
function createCheckoutPayload() {
    const userEmail = Storage.getEmail();
    
    // Calculate total
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Follow the specific format from the prompt image
    return {
        user: { email: userEmail },
        cart: state.cart,
        total: total,
        date: new Date().toISOString() // Standardized date string format
    };
}

/**
 * Handles the complete checkout flow when the user clicks 'Complete Purchase'.
 * Validates the cart, updates the UI to show a loading state, simulates an asynchronous API call,
 * and then handles success (clearing the cart) or failure states.
 */
async function handleCheckout() {
    if (state.cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const payload = createCheckoutPayload();
    const statusEl = document.getElementById('checkout-status'); // Create this in HTML
    
    if (!statusEl) return;
    
    // 1. Show Loading State
    statusEl.textContent = "Processing order...";
    statusEl.className = "loading";

    // 2. Simulate Delay
    setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate

        if (isSuccess) {
            // 3. Success Message
            statusEl.textContent = "Success! Your order has been placed.";
            statusEl.className = "success";

            // 4. Save finalized payload to localStorage
            Storage.saveOrder(payload);

            // 5. Clear Cart
            state.cart = [];
            syncCart();
        } else {
            // 6. Fail Message
            statusEl.textContent = "Error: Something went wrong with the transaction.";
            statusEl.className = "error";
        }
    }, 2000);
}
