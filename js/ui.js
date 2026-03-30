/**
 * Renders product cards into the grid.
 */
export function renderProducts(products, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = products.map(product => {
        // Clean up the image URL (removes brackets, quotes, and backslashes)
        let imageUrl = product.images[0] || 'https://placehold.co/200';
        if (imageUrl.startsWith('[')) {
            imageUrl = imageUrl.replace(/[\[\]"\\]/g, '');
        }

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

    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div class="item-info">
                    <strong>${item.name}</strong>
                    <span>$${item.price} each</span>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" data-id="${item.id}" data-action="dec">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');

    totalEl.textContent = `Total: $${total.toFixed(2)}`;
}
