import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/products")
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            setProducts(data);
            setLoading(false);
        })
        .catch(function () {
            setLoading(false);
        });
    }, []);

    function addToCart(product) {
        fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            product_id: product.id,
        }),
        }).then(function (res) {
        if (res.status === 401) {
            alert("Please login first to add products to your cart.");
            return;
        }

        alert(product.name, "added to cart!");
        });
    }

    return (
        <div className="container mt-4">
        <h2>All Products</h2>
        <p className="text-muted">We have {products.length} products available</p>
        <hr />

        {loading ? (
            <div className="text-center mt-5">
            <p>Loading...</p>
            </div>
        ) : (
            <div className="row">
            {products.map(function (product) {
                return (
                <div key={product.id} className="col-12 col-sm-6 col-md-4 mb-4">
                    <div className="card h-100">
                    <img
                        src={"/images/" + product.image}
                        className="card-img-top"
                        alt={product.name}
                    />
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="text-muted small">
                        {product.description.substring(0, 70)}...
                        </p>
                        <p className="text-success fw-bold fs-5">
                        ${product.price}
                        </p>
                        <div className="d-flex flex-wrap gap-2 mt-auto">
                        <Link
                            to={"/product/" + product.id}
                            className="btn btn-outline-primary btn-sm"
                        >
                            Details
                        </Link>
                        <button
                            className="btn btn-success btn-sm"
                            onClick={function () {
                            addToCart(product);
                            }}
                        >
                            Add to Cart
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        )}
        </div>
    );
}

export default Products;
