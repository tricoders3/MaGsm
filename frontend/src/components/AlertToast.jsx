import Modal from "react-bootstrap/Modal";
import { FiCheckCircle, FiHeart, FiShoppingCart } from "react-icons/fi";

const AlertToast = ({ show, onClose, type, message }) => {
  const iconMap = {
    cart: <FiShoppingCart size={32} />,
    favorite: <FiHeart size={32} />,
    success: <FiCheckCircle size={32} />,
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      contentClassName="alert-toast-modal"
    >
      <Modal.Body className="text-center p-4">
        <div className="icon-wrapper mb-3">{iconMap[type]}</div>
        <p className="mb-0 fw-semibold">{message}</p>
      </Modal.Body>
    </Modal>
  );
};

export default AlertToast;
