// mockApi.js
let stockData = {
    p1: 20,
    p2: 15,
    p3: 8,
};

export const fetchProductDetail = async (productId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟网络延迟

    // 模拟库存变化：每次请求减少 0~1 个
    const change = Math.floor(Math.random() * 2);
    stockData[productId] = Math.max(0, stockData[productId] - change);

    return {
        id: productId,
        name: `Product ${productId.toUpperCase()}`,
        price: (Math.random() * 100).toFixed(2),
        stock: stockData[productId],
        timestamp: new Date().toLocaleTimeString(),
    };
};
