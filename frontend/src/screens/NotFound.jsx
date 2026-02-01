import { Link } from "react-router-dom";
import NotFoundSvg from "../assets/images/not_found.svg";

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center mt-5">
    <div className="text-center p-4">
  
      <img
        src={NotFoundSvg}
        alt="Page not found"
        className="img-fluid mb-4"
        style={{ maxWidth: "520px" }}
      />
  
      <h4 className="text-dark mb-3">Page introuvable</h4>
  
      <p className="text-muted mb-4">
        Oups! La page que vous recherchez n’existe pas.
      </p>
  
      <Link to="/" className="btn btn-primary rounded-3 px-4">
        Retour à l’accueil
      </Link>
    </div>
  </div>
  
  );
};

export default NotFound;
