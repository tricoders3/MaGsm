import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Spinner, Badge } from "react-bootstrap";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import BASE_URL from "../constante";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import AlertToast from "../components/AlertToast"; // <-- import AlertToast


function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { cartCount, setCartCount, favoritesCount, setFavoritesCount } = useCart();
const { productName } = useParams();
  const [product, setProduct] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const MAX_LENGTH = 180;
  const isLongDescription = product?.description?.length > MAX_LENGTH;


  
  // NEW: selected image for thumbnails
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reset selected image whenever product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  // Fetch product & similar products
  useEffect(() => {
    const fetchProductAndSimilar = async () => {
      try {
        const resProduct = await axios.get(
          `${BASE_URL}/api/products/name/${encodeURIComponent(productName)}`
        );
        const currentProduct = resProduct.data;
        setProduct(currentProduct);

      
        const resPromo = await axios.get(
          `${BASE_URL}/api/promotions/product/${currentProduct._id}`
        );
        setPromotion(resPromo.data.promotion || null);

       
        if (currentProduct.category?._id) {
          const res = await axios.get(
            `${BASE_URL}/api/products/category/${currentProduct.category._id}`
          );

          const filtered = res.data
            .filter(
              p =>
                p._id !== currentProduct._id &&
                p.subCategory === currentProduct.subCategory
            )
            .slice(0, 4);

          // 🔥 FETCH PROMOTION FOR EACH SIMILAR PRODUCT
          const withPromotions = await Promise.all(
            filtered.map(async (p) => {
              try {
                const promoRes = await axios.get(
                  `${BASE_URL}/api/promotions/product/${p._id}`
                );
                return {
                  ...p,
                  promotion: promoRes.data.promotion || null,
                };
              } catch {
                return { ...p, promotion: null };
              }
            })
          );

          setSimilarProducts(withPromotions);
        }
      } catch (err) {
        console.error("Error loading product details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSimilar();
  }, [productName]);


  // Early returns
  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  if (!product) return <div className="text-center mt-5"><h3>Produit introuvable</h3></div>;

  // Use backend discountedPrice
  const discountedPrice = product.discountedPrice || product.price;
  const promoText = promotion ? (
    promotion.discountType === "percentage"
      ? `-${promotion.discountValue}%`
      : `-${promotion.discountValue} DT`
  ) : "";

  // Add to favorites
  const handleAddToFavorites = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/favorites/${product._id}`,
        {},
        { withCredentials: true }
      );
  
      setFavoritesCount(favoritesCount + 1);
      setToast({ show: true, message: "Produit ajouté aux favoris", type: "favorite" });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
  
    } catch (error) {
      const errMsg = error.response?.data?.message || "";
  
      if (error.response?.status === 401) {
        navigate("/login");
  
      } else if (
        error.response?.status === 409 ||
        errMsg.toLowerCase().includes("already in favorites") ||
        errMsg.toLowerCase().includes("déjà dans vos favoris")
      ) {
        setToast({
          show: true,
          message: "Produit déjà dans vos favoris",
          type: "favorite"
        });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
  
      } else {
        setToast({
          show: true,
          message: "Impossible d'ajouter aux favoris",
          type: "favorite"
        });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
      }
    }
  };
  

  // Add to cart
  const handleAddToCart = async () => {
    if (product.countInStock === "out") {
      setToast({ show: true, message: "Produit en rupture de stock", type: "cart" });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/cart`, { productId: product._id, quantity: 1 }, { withCredentials: true });
      setCartCount(cartCount + 1);

      setToast({ show: true, message: "Produit ajouté au panier", type: "cart" });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
      else {
        setToast({ show: true, message: "Impossible d'ajouter au panier", type: "cart" });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 1500);
      }
    }
  };


  return (
    <div className="container my-5 product-details-page">
      <div className="row g-4">

<div className="col-12 col-md-6 text-center position-relative">
  {product.images && product.images.length > 0 ? (
     <div className="product-image-wrapper d-inline-block position-relative">
     {/* Badge above the image */}
     {promotion && (
       <Badge bg="danger" className="product-badge mb-2">
         Promo! {promoText}
       </Badge>
     )}

     {/* Main Image */}
     <img
       src={product.images[selectedImageIndex]?.url}
       alt={product.name}
       className="img-fluid rounded-3 product-main-image"
     />
  
      <div className="d-flex gap-2 justify-content-center flex-wrap mt-2">
        {product.images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`thumb-${index}`}
            className={`rounded-2 border ${selectedImageIndex === index ? "border-secondary" : "border-light"}`}
            style={{ width: "60px", height: "60px", objectFit: "cover", cursor: "pointer" }}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="bg-light p-5 rounded-3">No image available</div>
  )}
</div>

        {/* Product Info */}
        <div className="col-12 col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted mb-1"><strong>Marque:</strong> {product.brand}</p>
          <p className="text-muted mb-3"><strong>Catégorie:</strong> {product.category?.name || "N/A"}</p>

        
          <div className="mb-3">
  <p className="product-price text-muted">
    {promotion ? (
      <>
        <span className="original-price text-muted">
          {product.price} DT
        </span>{" "}
        <span className="discounted-price">
          {discountedPrice} DT
        </span>
      </>
    ) : (
      `${product.price} DT`
    )}
  </p>
</div>

    
<p className="mb-3">
  {isLongDescription && !showFullDescription
    ? product.description.slice(0, MAX_LENGTH) + "..."
    : product.description}

  {isLongDescription && (
    <button
      onClick={() => setShowFullDescription(!showFullDescription)}
      className="btn btn-link p-0 ms-2"
      style={{ color: "#000", textDecoration: "underline" }}
    >
      {showFullDescription ? "Réduire" : "Lire la suite"}
    </button>
  )}
</p>


          <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mb-3">
          <Button
  variant="btn btn-primary"
  className="gap-2"
  onClick={handleAddToCart}
  title={
    product.countInStock === "out"
      ? "Produit en rupture de stock"
      : "Ajouter au panier"
  }
>
  <FiShoppingCart /> Ajouter au panier
</Button>



            <Button variant="btn btn-primary-redesign gap-2" onClick={handleAddToFavorites}>
              <FiHeart /> Ajouter aux favoris
            </Button>
          </div>

          <div>
  <p className="text-muted mb-1">
    <strong>Disponibilité:</strong>{" "}
    {product.countInStock === "out" ? (
      <span
       className="text-danger">Rupture de stock
       
  </span>
       
    ) : (
      <span className="text-success">En stock</span>
    )}
  </p>
</div>

        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-3 mt-md-5">
          <div className="mb-4">
            <h2 className="section-title">Produits similaires</h2>
            <p className="section-subtitle d-inline">Découvrez d'autres articles qui pourraient vous intéresser dans la même catégorie.</p>
          </div>

          <div className="row g-3">
            {similarProducts.map((prod) => (
              <div key={prod._id} className="col-6 col-sm-6 col-md-4 col-lg-3">
                <ProductCard 
  product={{
    id: prod._id,
    name: prod.name,
    price: prod.price,
    images: prod.images?.length ? prod.images : [{ url: "/assets/images/default.png" }],
    category: prod.subCategoryName || "N/A",
    countInStock: prod.countInStock,
    promotion: prod.promotion || null,
    discountedPrice: prod.promotion?.discountedPrice || null,
    hasPromotion: !!prod.promotion,
  }}
  badgeType={prod.promotion ? "promo" : "stock"}
  stockCount={prod.countInStock}
/>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AlertToast show={toast.show} onClose={() => setToast(prev => ({ ...prev, show: false }))} type={toast.type} message={toast.message} />
    </div>
  );
}

export default ProductDetails;
