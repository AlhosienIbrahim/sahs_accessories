import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/products/" + id)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setProduct(data);
        setLoading(false);
      })
      .catch(function () {
        setLoading(false);
      });
  }, [id]);

  function addToCart() {
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
      alert(product.name + " added to cart!");
    });
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-4">
        <p>Product not found!</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Link to="/products" className="btn btn-outline-secondary mb-3">
        ← Back to Products
      </Link>

      <div className="row">
        <div className="col-12 col-md-5 mb-3 mb-md-0">
          <img
            src={"/images/" + product.image}
            alt={product.name}
            className="img-fluid rounded border w-100"
            style={{ maxHeight: "350px", objectFit: "cover" }}
          />
        </div>

        <div className="col-12 col-md-7">
          <h2>{product.name}</h2>
          <hr />
          <p className="text-muted">{product.description}</p>
          <h3 className="text-success">${product.price}</h3>
          <p className="text-muted small">Product ID: #{product.id}</p>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-success btn-lg" onClick={addToCart}>
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            <Link to="/cart" className="btn btn-outline-dark btn-lg">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;