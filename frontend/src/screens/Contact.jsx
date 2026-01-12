import React, { useMemo, useState } from 'react';
import { useContent } from '../context/ContentContext';
import axios from 'axios';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import BASE_URL from '../constante';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { content } = useContent();
  const isValid = useMemo(() => {
    if (!form.name || !form.email || !form.message) return false;
    const emailOk = /.+@.+\..+/.test(form.email);
    return emailOk && form.message.length >= 10;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      await axios.post(`${BASE_URL}/api/contact`, form);
      setStatus({ type: 'success', message: "Merci ! Votre message a été envoyé avec succès." });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: "Une erreur s'est produite. Veuillez réessayer plus tard." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-page">
      {/* Hero header */}
      <div className="container py-5 py-lg-6">
        <div className="rounded-4 shadow-soft p-4 p-lg-5 contact-hero">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold hero-heading mb-3">Contactez-nous</h1>
              <p className="lead text-muted mb-0">
                Une question sur un produit, une commande, ou un partenariat ? Notre équipe vous répond rapidement.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="d-flex flex-wrap gap-3 justify-content-lg-end">
              <a className="btn btn-promo" href={`tel:${content?.contact?.phone || ''}`}>
  <FiPhone className="me-2" /> {content?.contact?.phone || '+216 00 000 000'}
</a>
<a className="btn btn-outline-promo" href={`mailto:${content?.contact?.email || ''}`}>
  <FiMail className="me-2" /> {content?.contact?.email || 'contact@magsm.tn'}
</a>
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="row g-3 g-md-4 mt-4">
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-start gap-3">
              <FiPhone className="text-primary" size={22} />
              <div>
                <strong className="text-secondary">Téléphone</strong>
                <div className="text-muted small">+216 00 000 000</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-start gap-3">
              <FiMail className="text-success" size={22} />
              <div>
                <strong className="text-secondary">Email</strong>
                <div className="text-muted small">contact@magsm.tn</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-start gap-3">
              <FiMapPin className="text-info" size={22} />
              <div>
                <strong className="text-secondary">Adresse</strong>
                <div className="text-muted small">Tunis, Tunisie</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-start gap-3">
              <FiClock className="text-warning" size={22} />
              <div>
                <strong className="text-secondary">Horaires</strong>
                <div className="text-muted small">Lun - Sam: 9h - 18h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form + Map */}
        <div className="row g-4 mt-4">
          <div className="col-lg-6">
            <div className="rounded-4 shadow-soft p-4 bg-white h-100">
              <h3 className="text-dark mb-3">Envoyez-nous un message</h3>
              {status.message && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {status.message}
                </div>
              )}
            <form onSubmit={handleSubmit} noValidate>
  <div className="row g-3">
    <div className="col-md-6">
      <label className="form-label">Nom complet</label>
      <input
        type="text"
        className="form-control form-control-modern"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Entrez votre nom complet"
        required
      />
    </div>
    <div className="col-md-6">
      <label className="form-label">Email</label>
      <input
        type="email"
        className="form-control form-control-modern"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Entrez votre email"
        required
      />
    </div>
    <div className="col-md-6">
      <label className="form-label">Téléphone</label>
      <input
        type="tel"
        className="form-control form-control-modern"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Entrez votre numéro de téléphone"
      />
    </div>
    <div className="col-md-6">
      <label className="form-label">Objet</label>
      <input
        type="text"
        className="form-control form-control-modern"
        name="subject"
        value={form.subject}
        onChange={handleChange}
        placeholder="Entrez l'objet du message"
      />
    </div>
    <div className="col-12">
      <label className="form-label">Message</label>
      <textarea
        className="form-control form-control-modern"
        name="message"
        rows={5}
        value={form.message}
        onChange={handleChange}
        placeholder="Écrivez votre message ici..."
        required
      />
    </div>
  </div>
  <div className="d-flex justify-content-end mt-3">
    <button
      type="submit"
      className="btn-redesign btn-primary d-inline-flex align-items-center gap-2"
      disabled={!isValid || submitting}
    >
      <FiSend /> {submitting ? 'Envoi...' : 'Envoyer'}
    </button>
  </div>
</form>

            </div>
          </div>
          <div className="col-lg-6">
            <div className="rounded-4 shadow-soft overflow-hidden h-100 bg-white">
              <div className="ratio ratio-16x9">
                <iframe
                  title="Localisation"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12768.14468058021!2d10.180!3d36.806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbinIAxMCc0Mi4x&quot;TiAxMMKwMTAnNDguMCJF!5e0!3m2!1sfr!2stn!4v0000000000"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-4 shadow-soft p-4 p-md-5 mt-4 bg-white">
          <h3 className="mb-3">Questions fréquentes</h3>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="q1">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#a1">
                  Comment suivre ma commande ?
                </button>
              </h2>
              <div id="a1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                <div className="accordion-body text-muted">
                  Connectez-vous à votre compte et ouvrez la section Commandes pour voir le statut en temps réel.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="q2">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a2">
                  Quels sont les délais de livraison ?
                </button>
              </h2>
              <div id="a2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body text-muted">
                  En général 24-72h selon votre région. Un suivi est fourni après l'expédition.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="q3">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#a3">
                  Comment effectuer un retour ?
                </button>
              </h2>
              <div id="a3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body text-muted">
                  Contactez-nous avec votre numéro de commande dans les 14 jours suivant la livraison.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
