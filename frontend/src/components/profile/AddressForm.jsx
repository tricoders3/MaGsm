import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import BASE_URL from "../../constante";
import { toast } from "react-toastify";

const ProfileDataForm = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
        address: {
          street: user.address?.street || "",
          postalCode: user.address?.postalCode || "",
          city: user.address?.city || "",
          country: user.address?.country || "Tunisie",
        },
      });
    }
  }, [user]);


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
      toast.success("Adresse mis à jour avec succès");
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
  <div className="card-body px-5 p-4">

        {/* PERSONAL INFO */}
        <h4 className="card-title text-center mb-4">Adresse</h4>
   
        <div className="mb-4">
          <input
            className="form-control mb-3"
            name="street"
            value={form.address.street}
            onChange={handleAddressChange}
            placeholder="Rue"
          />

          <input
            className="form-control mb-3"
            name="city"
            value={form.address.city}
            onChange={handleAddressChange}
            placeholder="Ville"
          />

          <input
            className="form-control mb-3"
            name="postalCode"
            value={form.address.postalCode}
            onChange={handleAddressChange}
            placeholder="Code postal"
          />

          <input
            className="form-control"
            name="country"
            value={form.address.country}
            onChange={handleAddressChange}
            placeholder="Pays"
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
