import React from "react";

function About() {
  return (
    <div className="container mt-4">
      <h2>About Us</h2>
      <hr />

      <div className="row">
        <div className="col-12 col-md-8 mb-4">
          <p className="fs-5">
            Welcome to <strong>Sahs Accessories</strong>! We are a small online
            store that sells tech accessories at good prices.
          </p>

          <p>
            We sell headphones, gaming mice, mechanical keyboards, cables, power
            banks, and more. We started this store because we love technology
            and we want to help people find the best accessories without
            spending too much money.
          </p>

          <p>
            Our products are carefully selected to make sure they are good
            quality. We test everything before we sell it. Customer satisfaction
            is very important to us and we try our best to make everyone happy.
          </p>

          <p>
            If you have any questions or problems with your order, please
            contact us and we will help you as soon as possible.
          </p>

          <h4 className="mt-4">Why Choose Us?</h4>
          <ul>
            <li>Good quality products</li>
            <li>Affordable prices</li>
            <li>Fast delivery</li>
            <li>Free shipping on all orders</li>
            <li>Cash on delivery</li>
            <li>Friendly customer support</li>
          </ul>
        </div>

        <div className="col-12 col-md-4">
          <div className="card p-4">
            <h5><i class="fa-solid fa-circle-info"></i> Our Info</h5>
            <hr />
            <p>
              <strong><i class="fas fa-map-marker-alt"></i> Location:</strong> Cairo, Egypt
            </p>
            <p>
              <strong><i class="fas fa-phone"></i> Phone:</strong> +20 123 456 789
            </p>
            <p>
              <strong><i class="fas fa-envelope"></i> Email:</strong> sahs.accessories@email.com
            </p>
            <p>
              <strong><i class="fas fa-clock"></i> Working Hours:</strong>
            </p>
            <p className="text-muted ms-3">Monday - Saturday: 9am - 6pm</p>
            <p className="text-muted ms-3">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;