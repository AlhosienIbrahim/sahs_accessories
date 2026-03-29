import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        phone: phone,
        address: address,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setLoading(false);
        setOrderId(data.orderId);
        setOrderDone(true);
      })
      .catch(() => {
        setLoading(false);
        alert("Something went wrong! Please try again.");
      });
  }

  if (orderDone) {
    return (
      <div className="container mt-5 text-center">
        <div className="card p-4 p-md-5">
          <h2 className="text-success">✅ Order Placed Successfully!</h2>
          <p className="mt-3 fs-5">
            Thank you <strong>{name}</strong>!
          </p>
          <p className="text-muted">Order ID: #{orderId}</p>
          <p>
            We will call you on <strong>{phone}</strong> to confirm your order.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              navigate("/");
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <p className="text-muted">Fill in your info to complete your order</p>
      <hr />

      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={function (e) {
                  setName(e.target.value);
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your phone number"
                value={phone}
                onChange={function (e) {
                  setPhone(e.target.value);
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Delivery Address *</label>
              <textarea
                className="form-control"
                placeholder="Enter your full address"
                value={address}
                onChange={function (e) {
                  setAddress(e.target.value);
                }}
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="col-12 col-md-6">
          <div className="card p-3">
            <h5>
              <i className="fa-solid fa-clipboard-list"></i> Order Notes
            </h5>
            <ul>
              <li>We will contact you to confirm</li>
              <li>Delivery is free</li>
              <li>Cash on delivery only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;