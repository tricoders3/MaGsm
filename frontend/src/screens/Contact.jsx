import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import BASE_URL from '../constante';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
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
    if (!form.name || !form.email || !form.message) return false;
    const emailOk = /.+@.+\..+/.test(form.email);
    return emailOk && form.message.length >= 10;
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
        console.error('Failed to load contact info', err);
      }
    };
    fetchSettings();
  }, []);

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
                <a className="btn btn-promo" href={`tel:${contactInfo.phone}`}>
                  <FiPhone className="me-2" /> {contactInfo.phone}
                </a>
                <a className="btn btn-outline-promo" href={`mailto:${contactInfo.email}`}>
                  <FiMail className="me-2" /> {contactInfo.email}
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
                <div className="text-muted small">{contactInfo.phone}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-start gap-3">
              <FiMail className="text-success" size={22} />
              <div>
                <strong className="text-secondary">Email</strong>
                <div className="text-muted small">{contactInfo.email}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-start gap-3">
              <FiMapPin className="text-info" size={22} />
              <div>
                <strong className="text-secondary">Adresse</strong>
                <div className="text-muted small">{contactInfo.address}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="rounded-4 shadow-soft p-3 h-100 bg-white d-flex align-items-start gap-3">
              <FiClock className="text-warning" size={22} />
              <div>
                <strong className="text-secondary">Horaires</strong>
                <div className="text-muted small">{contactInfo.hours}</div>
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
                  src={contactInfo.mapEmbedUrl || "https://www.google.com/maps?q=Tunisia&output=embed"}
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
