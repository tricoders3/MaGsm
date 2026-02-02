import React from "react";
import { FaPhoneAlt, FaFacebookF, FaInstagram, FaWhatsapp ,FaTiktok} from "react-icons/fa";

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
    href="https://www.facebook.com/share/1HkBqAnKHi/?mibextid=wwXIfr"
    target="_blank"
    rel="noopener noreferrer"
    className="text-light me-2"
  >
    <FaFacebookF size={18}/>
  </a>

  <a
    href="https://www.instagram.com/ma_gsm_/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-light me-2"
  >
    <FaInstagram size={18}/>
  </a>
   <a
    href="https://www.tiktok.com/@ma_gsm"
    target="_blank"
    rel="noopener noreferrer"
    className="text-light me-2"
  >
    <FaTiktok size={18}/>
  </a>
  <a
            href="https://wa.me/21620771717?text=مرحبا%20👋%20نحب%20نستفسر%20على%20منتجاتكم%20من%20فضلكم" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <FaWhatsapp size={18}/>
          </a>
     </div>
      </div>
    </div>
  );
};

export default TopBar;
