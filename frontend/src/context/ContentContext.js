import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ContentContext = createContext(null);

const DEFAULTS = {
  offers: {
    title: "Offres Spéciales",
    description: "Profitez de remises exclusives sur les accessoires GSM les plus demandés.",
    active: true,
  },
  about: {
    title: "Who we are",
    content:
      "Carefully selected products, customer-first support and fast service. Learn more about our mission and values.",
  },
  banner: {
    headline: "Découvrez nos meilleures offres",
    subtext: "Qualité premium, prix imbattables.",
    imageUrl: "",
  },
  contact: {
    email: "contact@magsm.tn",
    phone: "+216 00 000 000",
    address: "123 Avenue Centrale, Casablanca, Morocco",
    mapEmbedUrl:
      "https://www.google.com/maps?q=123%20Avenue%20Centrale%2C%20Casablanca%2C%20Morocco&output=embed",
  },
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    const saved = localStorage.getItem("content_store");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContent((prev) => ({ ...prev, ...parsed }));
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("content_store", JSON.stringify(content));
  }, [content]);

  const updateOffers = (updates) =>
    setContent((c) => ({ ...c, offers: { ...c.offers, ...updates } }));
  const updateAbout = (updates) =>
    setContent((c) => ({ ...c, about: { ...c.about, ...updates } }));
  const updateBanner = (updates) =>
    setContent((c) => ({ ...c, banner: { ...c.banner, ...updates } }));
  const updateContact = (updates) =>
    setContent((c) => ({ ...c, contact: { ...c.contact, ...updates } }));

  const value = useMemo(
    () => ({ content, updateOffers, updateAbout, updateBanner, updateContact }),
    [content]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);
