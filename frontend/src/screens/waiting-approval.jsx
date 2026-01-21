import React from "react";

function WaitingApproval() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", textAlign: "center" }}>
        <h1 className="mb-3">Compte en attente</h1>
        <p className="mb-2">
          Merci pour votre inscription ! <br />
          Votre compte est actuellement en attente d'approbation par un administrateur.
        </p>
        <p>
          Vous recevrez un email dès que votre compte sera activé.
        </p>
        <button className="btn btn-primary mt-3" onClick={() => window.location.href = "/"}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default WaitingApproval;
