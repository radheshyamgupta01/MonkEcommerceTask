/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./ProductForm.css";
import SelectProduct from "./SelectProduct";
import products from "./../assets/productsLists";

const AddProduct = ({ index, itemOfProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDiscountInputs, setShowDiscountInputs] = useState(false);
  const [showProductVariants, setShowProductVariants] = useState(false);

  const findProductWithMatchingVariants = (products, criteria) => {
    const product = products.find((product) => product.id === criteria.id);
    if (!product) {
      return null; // Return null if no product matches the ID
    }
    // Filter variants that match the criteria
    const matchingVariants = product.variants.filter((variant) =>
      criteria.variants.includes(variant.id)
    );

    // Return the product with only matching variants
    return {
      ...product,
      variants: matchingVariants,
    };
  };
  const [
    foundProductWithMatchingVariants,
    setFoundProductWithMatchingVariants,
  ] = useState(() => findProductWithMatchingVariants(products, itemOfProduct));

  // console.log(itemOfProduct.variants.length === 1);

  

  // useEffect to update product variants when the criteria or products change
  useEffect(() => {
    setFoundProductWithMatchingVariants(
      findProductWithMatchingVariants(products, itemOfProduct)
    );
    setShowProductVariants(itemOfProduct?.variants?.length == 1 ? false : true);
  }, [itemOfProduct]); // Correct dependencies

  // Function to handle the deletion of a variant
  const deleteVariantHandler = (variantId) => {
    setFoundProductWithMatchingVariants((prevProduct) => ({
      ...prevProduct,
      variants: prevProduct.variants.filter(
        (variant) => variant.id !== variantId
      ),
    }));
  };
  const deleteProductHandler = () => {
    if (onDeleteProduct) {
      onDeleteProduct(itemOfProduct?.id);
    }
  };

  // Function to handle modal open
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="add-product-form">
      <div className="form-group">
        {index === 0 && <label htmlFor="product-select">Product</label>}
        <input
          id="product-select"
          type="search"
          value={foundProductWithMatchingVariants?.title || "Select a product"}
          onClick={handleOpenModal}
          readOnly
        />
      </div>
      <div className="form-group">
        {index === 0 && <label htmlFor="discount">Discount</label>}
        {showDiscountInputs ? (
          <div className="discount-inputs">
            <input type="text" placeholder="Enter discount" />
            <select>
              <option value="flat">Flat off</option>
              <option value="percent">% off</option>
            </select>
            <button
              onClick={() =>
                deleteProductHandler(foundProductWithMatchingVariants?.id)
              }
            >
              x
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDiscountInputs(true)}
            type="button"
            id="discount"
          >
            Add Discount
          </button>
        )}
      </div>

      <div className=""></div>

      {/* Show variants of the selected product */}
      {Object.keys(itemOfProduct).length !== 0 && (
        <ul className="list-of-variants">
          <button onClick={() => setShowProductVariants((prev) => !prev)}>
            {showProductVariants ? "hide variants" : "show variants"}
          </button>
          {showProductVariants &&
            foundProductWithMatchingVariants?.variants.map((variant) => (
              <li key={variant.id}>
                <p>
                  {variant.title}
                  <span>Rs {variant.price}</span>
                </p>
                <button onClick={() => deleteVariantHandler(variant.id)}>
                  x
                </button>
              </li>
            ))}
        </ul>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <SelectProduct handleCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
