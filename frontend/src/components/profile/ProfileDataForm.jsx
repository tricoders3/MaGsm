import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";

const ProfileDataForm = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      postalCode: "",
      city: "",
      country: "Tunisie",
    },
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          postalCode: user.address?.postalCode || "",
          city: user.address?.city || "",
          country: user.address?.country || "Tunisie",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      address: {
        ...form.address,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${BASE_URL}/api/user/me`,
        form,
        { withCredentials: true }
      );
      updateUser(data.user);
      toast.success("Profil mis à jour avec succès ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* ================= INFOS PERSONNELLES ================= */}
          <div className="col-12 col-md-6">
            <div className="card h-100 shadow-sm rounded-4 border-0">
              <div className="card-body p-4">
                <h5 className="mb-4 text-dark">Informations personnelles</h5>

                <input
                  className="form-control mb-3"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nom"
                />

                <input
                  className="form-control mb-3"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                />

                <input
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Téléphone"
                />
              </div>
            </div>
          </div>

          {/* ================= ADRESSE ================= */}
          <div className="col-12 col-md-6 ">
            <div className="card h-100 shadow-sm rounded-4 border-0">
              <div className="card-body p-4">
                <h5 className="mb-4 text-dark">Adresse</h5>

                <input
                  className="form-control mb-3"
                  name="street"
                  value={form.address.street}
                  onChange={handleAddressChange}
                  placeholder="Rue"
                />

                <div className="row">
                  <div className="col-6">
                    <input
                      className="form-control mb-3"
                      name="postalCode"
                      value={form.address.postalCode}
                      onChange={handleAddressChange}
                      placeholder="Code postal"
                    />
                  </div>

                  <div className="col-6">
                    <input
                      className="form-control mb-3"
                      name="city"
                      value={form.address.city}
                      onChange={handleAddressChange}
                      placeholder="Ville"
                    />
                  </div>
                </div>

                <input
                  className="form-control"
                  name="country"
                  value={form.address.country}
                  onChange={handleAddressChange}
                  placeholder="Pays"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ================= ACTION ================= */}
        <div className="mt-4 text-center">
          <button
            className="btn btn-primary px-5 rounded-pill"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDataForm;
