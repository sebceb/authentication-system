const BASE_URL = 'https://api.escuelajs.co/api/v1';

/**
 * Fetches all available categories.
 * Returns an array of category objects.
 */
export async function fetchCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        
        // Return all categories so higher indices like 37 will work
        return data;
    } catch (error) {
        console.error('API Error (Categories):', error);
        return [];
    }
}

/**
 * Fetches products based on specific filter criteria.
 * @param {Object} filters - { categoryId, minPrice, maxPrice }
 */
export async function fetchProducts(filters) {
    const { categoryId, minPrice, maxPrice } = filters;

    // Use URLSearchParams for robust query string construction
    const params = new URLSearchParams({
        offset: 0,
        limit: 800 // Massive limit to guarantee 25+ items after strict whitelist filtering
    });

    // Platzi API specific keys: categoryId, price_min, price_max
    if (categoryId) params.append('categoryId', categoryId);
    if (minPrice !== null && minPrice !== undefined) params.append('price_min', minPrice);
    if (maxPrice !== null && maxPrice !== undefined) params.append('price_max', maxPrice);

    try {
        const url = `${BASE_URL}/products?${params.toString()}`;
        console.log(`Fetching: ${url}`); // Debugging tip for sophomores
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        return await response.json();
    } catch (error) {
        console.error('API Error (Products):', error);
        return [];
    }
}