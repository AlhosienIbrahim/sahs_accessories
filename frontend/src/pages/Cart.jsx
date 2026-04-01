import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Cart() {
  let [cart, setCart] = useState([]);
  function loadCart() {
    fetch("/cart", { credentials: "include" })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (Array.isArray(data)) {
          setCart(data);
        } else {
          setCart([]);
        }
      });
  }

  useEffect(() => {
    loadCart();
  }, []);

  function removeItem(pid) {
    fetch("/cart/" + pid, { method: "DELETE" }).then(() => {
      loadCart();
    });
  }

  function increaseQty(pid, qty) {
    fetch("/cart/" + pid, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty + 1 }),
    }).then(() => {
      loadCart();
    });
  }

  function decreaseQty(pid, qty) {
    fetch("/cart/" + pid, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty - 1 }),
    }).then(() => {
      loadCart();
    });
  }

  function clearCart() {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      fetch("/cart", { method: "DELETE" }).then(() => {
        setCart([]);
      });
    }
  }

  function getTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].quantity;
    }
    return total.toFixed(2);
  }

  return (
    <div className="container mt-4">
      <h2>
        <i className="fa-solid fa-cart-shopping"></i> My Cart
      </h2>
      <hr />

      {cart.length === 0 ? (
        <div className="text-center mt-5">
          <h4>Your cart is empty!</h4>
          <p className="text-muted">Go add some products</p>
          <Link to="/products" className="btn btn-primary mt-2">
            Go to Products
          </Link>
        </div>
      ) : (
        <div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  return (
                    <tr key={item.product_id}>
                      <td>
                        <img
                          src={"/images/" + item.image}
                          alt={item.name}
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => {
                            decreaseQty(item.product_id, item.quantity);
                          }}
                        >
                          -
                        </button>
                        <span className="mx-2 fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => {
                            increaseQty(item.product_id, item.quantity);
                          }}
                        >
                          +
                        </button>
                      </td>
                      <td className="text-success fw-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            removeItem(item.product_id);
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row justify-content-end">
            <div className="col-12 col-md-4">
              <div className="card p-3">
                <h5>Order Summary</h5>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Items ({cart.length}):</span>
                  <span>${getTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <span>Shipping:</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span className="text-success">${getTotal()}</span>
                </div>
                <Link to="/checkout" className="btn btn-success mt-3 w-100">
                  Proceed to Checkout
                </Link>
                <button
                  className="btn btn-outline-danger mt-2 w-100"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;