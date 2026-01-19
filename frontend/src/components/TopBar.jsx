import React from "react";
import { FaPhoneAlt, FaFacebookF, FaInstagram } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="text-light py-2" style={{ backgroundColor: "#0f1115" }}>
      <div className="container d-flex justify-content-between align-items-center">
        
        
        <div className="small d-flex align-items-center">
  <FaPhoneAlt className="me-2" />
  +216 20 771 717
</div>


        <div className="small d-flex align-items-center">
        <a
    href="https://www.facebook.com/yourpage"
    target="_blank"
    rel="noopener noreferrer"
    className="text-light me-2"
  >
    <FaFacebookF size={18}/>
  </a>

  <a
    href="https://www.instagram.com/yourpage"
    target="_blank"
    rel="noopener noreferrer"
    className="text-light"
  >
    <FaInstagram size={18}/>
  </a>
     </div>
      </div>
    </div>
  );
};

export default TopBar;
