import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";

const ProfileDataForm = () => {
  const { user, updateUser } = useAuth();
  const [profil, setProfil] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfil({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => setProfil({ ...profil, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${BASE_URL}/api/user/me`,
        profil,
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
<div className="container py-5">
<div className="row justify-content-center">
<div className="col-12 col-sm-10 col-md-8 col-lg-6">
<div className="card shadow-lg rounded-4 border-0">
<div className="card-body p-4">
<h4 className="card-title text-center mb-4">Modifier le profil</h4>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3" name="name" value={profil.name} onChange={handleChange} placeholder="Nom" />
          <input className="form-control mb-3" name="email" value={profil.email} onChange={handleChange} placeholder="Email" />
          <input className="form-control mb-3" name="phone" value={profil.phone} onChange={handleChange} placeholder="Téléphone" />
          <input className="form-control mb-4" name="address" value={profil.address} onChange={handleChange} placeholder="Adresse" />
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Chargement..." : "Enregistrer les modifications"}
          </button>
        </form>
        </div>
</div>
</div>
</div>
</div>
  
  );
};

export default ProfileDataForm;
