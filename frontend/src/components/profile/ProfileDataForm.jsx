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
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
      toast.success("Profil mis à jour avec succès");
    } catch (err) {
 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
    <div className="row justify-content-center">
    <div className="col-12 col-sm-10 col-md-8 col-lg-6">
  <form onSubmit={handleSubmit}>
  <div className="card shadow-sm rounded-4 border-0">
  <div className="card-body px-3 p-4">

        {/* PERSONAL INFO */}
        <h4 className="card-title text-center mb-4">Informations personnelles</h4>
   

        <div className="mb-4">
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
    
        {/* ACTION */}
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary-redesign w-100"  disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>

      </div>
    </div>
  </form>
</div>
</div>
</div>
  );
};

export default ProfileDataForm;
