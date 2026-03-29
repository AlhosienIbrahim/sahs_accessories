import React, { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="container mt-4">
      <h2>Contact Us</h2>
      <p className="text-muted">We are happy to hear from you!</p>
      <hr />

      <div className="row">
        <div className="col-12 col-md-7 mb-4">
          <h5>Send us a Message</h5>

          {sent ? (
            <div className="alert alert-success mt-3">
              <h5>✅ Message Sent!</h5>
              <p className="mb-0">Thank you! We will reply to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="mb-3">
                <label className="form-label">Your Name</label>
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
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={function (e) {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Your Message</label>
                <textarea
                  className="form-control"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={function (e) {
                    setMessage(e.target.value);
                  }}
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="col-12 col-md-5">
          <div className="card p-4">
            <h5>Contact Information</h5>
            <hr />
            <p>
              <strong>
                <i class="fa-solid fa-location-dot"></i> Address:
              </strong>
              <br />
              <span className="text-muted ms-3">Suez, Egypt</span>
            </p>
            <p>
              <strong>
                <i class="fa-solid fa-phone"></i> Phone:
              </strong>
              <br />
              <span className="text-muted ms-3">+20 1055 611 680</span>
            </p>
            <p>
              <strong>
                <i class="fa-solid fa-envelope"></i> Email:
              </strong>
              <br />
              <span className="text-muted ms-3">
                sahs.accessories@email.com
              </span>
            </p>
            <p>
              <strong>
                <i class="fas fa-clock"></i> Working Hours:
              </strong>
              <br />
              <span className="text-muted ms-3">Mon-Sat: 9am - 6pm</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;