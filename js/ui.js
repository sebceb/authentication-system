/**
 * Renders product cards into the grid.
 */
export function renderProducts(products, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = products.map(product => {
        let imageUrl = product.images[0] || 'https://placehold.co/200';
        
        // Unconditionally strip out brackets, quotes, and backslashes 
        // and take the first URL in case there are comma-separated links
        imageUrl = imageUrl.replace(/[\[\]"\\]/g, '').split(',')[0].trim();

        return `
            <div class="product-card">
                <div class="product-img-container">
                    <img src="${imageUrl}" alt="${product.title}" onerror="this.src='https://placehold.co/200'">
                </div>
                <h3>${product.title}</h3>
                <p class="price">$${product.price}</p>
                <button class="add-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
    }).join('');
}

/**
 * Renders the cart items and calculates the total.
 */
export function renderCart(cart, itemsId, totalId) {
    const container = document.getElementById(itemsId);
    const totalEl = document.getElementById(totalId);
    if (!container || !totalEl) return;

    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalEl.textContent = `Total: $0.00`;
        return;
    }

    const headerHtml = `
        <div class="cart-header">
            <div>Item</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
        </div>
    `;

    const itemsHtml = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div class="cart-col"><strong>${item.name}</strong></div>
                <div class="cart-col">$${item.price}</div>
                <div class="cart-col item-controls">
                    <button class="qty-btn" data-id="${item.id}" data-action="dec">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
                </div>
                <div class="cart-col item-total">
                    $${itemTotal.toFixed(2)}
                    <button class="remove-btn" data-id="${item.id}" title="Remove">X</button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = headerHtml + itemsHtml;
    totalEl.textContent = `Total: $${total.toFixed(2)}`;
}
