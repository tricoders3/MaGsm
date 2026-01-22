import React from "react";

function WaitingApproval() {
  return (
<div className="container mt-5">
  <div className="row justify-content-center">
    <div className="col-md-8 col-lg-6">
      <div className="card text-center border-0 shadow-sm">
        <div className="card-body py-5 px-4">

          <div className="mb-3">
          <span className="status-approve-badge">
  En attente de validation
</span>

          </div>

          <h1 className="fw-semibold mb-3">
            Compte en attente
          </h1>

          <p className="text-muted mb-2">
            Merci pour votre inscription.
          </p>

          <p className="text-muted mb-4">
            Votre compte est actuellement en cours de vérification par
            l’administrateur de <strong className="text-dark">MaGsm</strong>.
            Vous recevrez un email dès qu’il sera activé.
          </p>

          <button
            className="btn btn-primary px-4"
            onClick={() => (window.location.href = "/")}
          >
            Retour à l'accueil
          </button>

        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default WaitingApproval;
