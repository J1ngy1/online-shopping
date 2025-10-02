import React, { useState } from "react";
import "./App.css";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import { fetchProductDetail } from "./mockApi";
import myUseQuery from "./hooks/myUseQuery"

const queryClient = new QueryClient();

function ProductDetail({ productId }) {
    const { data, isLoading, isError, error, refetch, isFetching } = myUseQuery({
        // queryKey: ["product-detail", productId],
        queryFn: () => fetchProductDetail(productId),
        staleTime: 5000,
        // cacheTime: 1000 * 60,
        // refetchInterval: 3000,
        // retry: 1,
    });

    if (isLoading) return <p>Loading product {productId}...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>{data?.name}</h2>
            <p>💲 Price: ${data?.price}</p>
            <p>📦 Stock: {data?.stock}</p>
            <p>⏰ Last Updated: {data?.timestamp}</p>
            <button onClick={() => refetch()}>
                {isFetching ? "Refreshing..." : "Manual Refetch"}
            </button>
        </div>
    );
}

function App() {
    const [currentProduct, setCurrentProduct] = useState(null);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="app">
                <h1>🛍 Online Shop</h1>
                {!currentProduct ? (
                    <div>
                        <h3>Product List</h3>
                        <button onClick={() => setCurrentProduct("p1")}>
                            Go to Product 1
                        </button>
                        <button onClick={() => setCurrentProduct("p2")}>
                            Go to Product 2
                        </button>
                        <button onClick={() => setCurrentProduct("p3")}>
                            Go to Product 3
                        </button>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => setCurrentProduct(null)}>
                            ⬅ Back to list
                        </button>
                        <ProductDetail productId={currentProduct} />
                    </div>
                )}
            </div>
        </QueryClientProvider>
    );
}

export default App;
