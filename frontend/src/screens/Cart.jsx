import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import EmptyCart from "../assets/images/empty_cart.png";
import {  FaTrash } from 'react-icons/fa';

const Cart = () => {
  const [favorites, setFavorites] = useState([]);

  
  return (
    <div className="container">
      <div className="shopping--cart--container">
      
       
  <div>
    <div style={{ height: 30 }}></div>

      <div  className="card mb-3">
        <div className="row align-items-center">
        <div className="row align-items-center">
              <div className="col-md-2">
                <img
                 
                
                  className="img-fluid"
                />
              </div>
              <div className="col-md-2">
                <p className="small text-muted mb-2">Product Name</p>
                <p className="lead fw-normal mb-0"></p>
              </div>
              <div className="col-md-2">
                <p className="small text-muted mb-2">Quantity</p>
                <p className="lead fw-normal mb-0"></p>
              </div>
              <div className="col-md-2">
                <p className="small text-muted mb-2">Total Price</p>
                <p className="lead fw-normal mb-0"></p>
              </div>
              <div className="col-md-2">
                <Button
                  variant="danger"
                  size="sm"
                  
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>
          </div>

    <div className="card mb-5">
      <div className="card-body p-4">
        <div className="float-end">
          <p className="mb-0 me-5 d-flex align-items-center">
            <span className="text-muted me-2">Order total:</span>
            <span className="lead fw-normal">$</span>
          </p>
        </div>
      </div>
    </div>

    <div className="d-flex justify-content-end">
      <Button variant="light" size="lg" className="me-2">
        Continue shopping
      </Button>
      <Button variant="primary" size="lg">
        Proceed to checkout
      </Button>
    </div>
  </div>

  <div className="text-center">
    <img
      src={EmptyCart}
      alt=""
      className="img-fluid"
      style={{ maxHeight: 400, maxWidth: 400 }}
    />
  </div>


      </div>
    </div>
  );
};



export default Cart;
