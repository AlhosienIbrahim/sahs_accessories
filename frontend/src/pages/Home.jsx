import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/products")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setProducts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
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
        alert("Please login first to add products to cart");
        return;
      }

      alert(product.name + " added to cart!");
    });
  }

  return (
    <div>
      <div className="hero-section">
        <h1>Welcome to Sahs Accessories</h1>
        <p>Find the best tech accessories with best prices</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Shop Now
        </Link>
      </div>

      <div className="container mt-4 mt-md-5">
        <h2>Featured Products</h2>
        <p className="text-muted">Check out our popular products</p>
        <hr />

        {loading ? (
          <p>Loading products please wait...</p>
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
                      <p className="text-success fw-bold">${product.price}</p>
                      <div className="d-flex flex-wrap gap-2 mt-auto">
                        <Link
                          to={"/product/" + product.id}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                        </Link>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => {
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

        <div className="text-center mt-3">
          <Link to="/products" className="btn btn-dark">
            See All Products
          </Link>
        </div>
      </div>

      <div className="container mt-4 mt-md-5">
        <div className="row text-center">
          <div className="col-12 col-md-4 mb-3">
            <div className="card p-4">
              <h4>
                <i className="fa-solid fa-truck-fast"></i> Fast Delivery
              </h4>
              <p>We deliver quickly to your door</p>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <div className="card p-4">
              <h4>
                <i className="fas fa-star"></i> Good Quality
              </h4>
              <p>All products are tested and good quality</p>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <div className="card p-4">
              <h4>
                <i className="fa-solid fa-phone"></i> Support
              </h4>
              <p>We are here to help you anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
