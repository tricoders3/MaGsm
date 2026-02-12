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
          <div dir="rtl" className="account-pending-text">
<h2 className="fw-semibold pending-title mb-3">
  الحساب في انتظار التفعيل
</h2>

<p className="text-muted mb-0">
  شكرا على ثقتك في <strong className="text-dark">MaGsm</strong> ومرحبا بيك في عايلتنا!
</p>

<p className="text-muted mb-0">
  أول ما يتفعل حسابك، توصلك رسالة على الإيميل 📩، عادة ما ياخذش وقت طويل.
</p>

<p className="text-muted mb-4">
  🎁 وتربح معانا <strong className="text-dark">100 Point fidélité</strong> تنجّم تستعملهم في الشراء الجاي 😉
</p>
</div>
          

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
