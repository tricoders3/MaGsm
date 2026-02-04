import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import BASE_URL from '../constante';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const statusRef = useRef(null);
  const [contactInfo, setContactInfo] = useState({
    title: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    hours: '',
    mapEmbedUrl: ''
  });

  const isValid = useMemo(() => {
    if (!form.name || !form.email  || !form.message) return false;
    const emailOk = /.+@.+\..+/.test(form.email);
    return emailOk && form.message.length >= 1;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/site-settings`);
        const c = data?.contact || {};
        setContactInfo({
          title: c.title || 'Contactez-nous',
          description: c.description || 'Notre équipe vous répond rapidement',
          phone: c.phone || '+216 00 000 003',
          email: c.email || 'contact@magsm.tn',
          address: c.address || 'Tunis, Tunisie',
          hours: c.hours || 'Lun - Sam: 9h - 18h',
          mapEmbedUrl: c.mapEmbedUrl || ''
        });
      } catch (err) {
        setError(true);
        } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Auto-scroll to status and auto-dismiss after 5s
  useEffect(() => {
    if (status.message) {
      // Scroll into view
      statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Auto-dismiss
      const t = setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      return () => clearTimeout(t);
    }
  }, [status]);

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
  if (loading || error || !contactInfo) return null;
  return (
    <section className="contact-page">
      <div className="container py-5 py-lg-6">
        {/* Hero header */}
        <div className="rounded-4 shadow-soft p-4 p-lg-5 contact-hero">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold hero-heading mb-3">{contactInfo.title}</h1>
              <p className="lead text-muted mb-0">{contactInfo.description}</p>
            </div>
            <div className="col-lg-5">
              <div className="d-flex flex-wrap gap-3 justify-content-lg-end">
                <a className="btn btn-phone text-dark" href={`tel:${contactInfo.phone}`}>
                  <FiPhone className="text-dark me-2" /> {contactInfo.phone}
                </a>
                <a className="btn btn-outline-promo" href={`mailto:${contactInfo.email}`}>
                  <FiMail className="me-2" /> {contactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="row g-3 mt-4">
  {[
    { icon: <FiPhone className="text-primary" />, label: "Téléphone", value: contactInfo.phone },
    { icon: <FiMail className="text-success" />, label: "Email", value: contactInfo.email },
    { icon: <FiMapPin className="text-info" />, label: "Adresse", value: contactInfo.address },
    { icon: <FiClock className="text-warning" />, label: "Horaires", value: contactInfo.hours },
  ].map((item, index) => (
    <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-3">
      <div className="contact-card rounded-4  p-3 d-flex align-items-start gap-3 bg-white h-100">
        <div className="contact-icon fs-4">{item.icon}</div>
        <div className="contact-text">
          <strong className="text-secondary d-block mb-1">{item.label}</strong>
          <div className="text-muted small">{item.value}</div>
        </div>
      </div>
    </div>
  ))}
</div>


        {/* Form + Map */}
        <div className="row g-4 mt-4">
          <div className="col-lg-6">
            <div className="rounded-4 shadow-soft p-4 bg-white h-100">
              <h3 className="text-dark mb-3">Envoyez-nous un message</h3>
              {status.message && (
                <div
                  ref={statusRef}
                  className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex justify-content-between align-items-center`}
                  role="status"
                  aria-live="polite"
                >
                  <span>{status.message}</span>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Fermer"
                    onClick={() => setStatus({ type: '', message: '' })}
                  />
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
                      required
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
            <div className="rounded-4 shadow-soft overflow-hidden  bg-white">
              <div className="ratio ratio-4x3">
                <iframe
                  title="Localisation"
                  src={contactInfo.mapEmbedUrl || "https://www.google.com/maps?q=35.67322432149297,10.098604243817753&output=embed"}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
