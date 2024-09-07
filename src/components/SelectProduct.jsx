/* eslint-disable react/prop-types */
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

const products = [
  {
    id: 77,
    title: "Fog Linen Chambray Towel - Beige Stripe",
    variants: [
      {
        id: 1,
        product_id: 77,
        title: "XS / Silver",
        price: "49",
      },
      {
        id: 2,
        product_id: 77,
        title: "S / Silver",
        price: "49",
      },
      {
        id: 3,
        product_id: 77,
        title: "M / Silver",
        price: "49",
      },
    ],
    image: {
      id: 266,
      product_id: 77,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1",
    },
  },
  {
    id: 80,
    title: "Orbit Terrarium - Large",
    variants: [
      {
        id: 64,
        product_id: 80,
        title: "Default Title",
        price: "109",
      },
    ],
    image: {
      id: 272,
      product_id: 80,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1",
    },
  },
];

const SelectProduct = ({ handleCloseModal }) => {
  const { setProducts } = useAppContext();
  const [selectedItems, setSelectedItems] = useState({});
  const [searchProduct, setSearchProduct] = useState("");

  // Handle product selection
  const handleProductChange = (product, variant) => {
    const newSelectedItems = { ...selectedItems };

    if (variant) {
      newSelectedItems[product.id] = newSelectedItems[product.id] || {
        variants: {},
      };
      newSelectedItems[product.id].variants[variant.id] =
        !newSelectedItems[product.id].variants[variant.id];

      // Check if at least one variant is selected
      if (Object.values(newSelectedItems[product.id].variants).some((v) => v)) {
        newSelectedItems[product.id].selected = true;
      } else {
        delete newSelectedItems[product.id];
      }
    } else {
      if (newSelectedItems[product.id]?.selected) {
        delete newSelectedItems[product.id];
      } else {
        newSelectedItems[product.id] = {
          selected: true,
          variants: Object.fromEntries(
            product.variants.map((variant) => [variant.id, true])
          ),
        };
      }
    }

    setSelectedItems(newSelectedItems);

    // Convert selectedItems to array format
    const selectedArray = Object.entries(newSelectedItems).map(
      ([id, item]) => ({
        id: parseInt(id),
        selected: item.selected,
        variants: Object.entries(item.variants)
          .filter(([_, isSelected]) => isSelected)
          .map(([variantId]) => parseInt(variantId)),
      })
    );

    // Update the global state with merged data
    setProducts((prevProducts) => {
      // Create a new array with the previous products and update the ones being changed
      const updatedProducts = [...prevProducts];

      selectedArray.forEach((newProduct) => {
        const existingProductIndex = updatedProducts.findIndex(
          (product) => product.id === newProduct.id
        );

        if (existingProductIndex > -1) {
          // If the product already exists, merge the variants
          const existingProduct = updatedProducts[existingProductIndex];
          const mergedVariants = Array.from(
            new Set([...existingProduct.variants, ...newProduct.variants])
          );
          updatedProducts[existingProductIndex] = {
            ...existingProduct,
            variants: mergedVariants,
          };
        } else {
          // If the product doesn't exist, add it to the array
          updatedProducts.push(newProduct);
        }
      });

      return updatedProducts;
    });
  };

  return (
    <>
      <header>
        <p>Select Products</p>
        <div>
          <button onClick={handleCloseModal}>X</button>
        </div>
      </header>
      <section>
        <input
          type="search"
          placeholder="Search Product"
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
        />
      </section>
      <div className="products-list">
        {products
          .filter((productData) =>
            productData.title
              .toLowerCase()
              .includes(searchProduct.toLowerCase())
          )
          .map((product) => (
            <div className="product-container" key={product.id}>
              {/* Product Checkbox */}
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  name={`product-${product.id}`}
                  checked={selectedItems[product.id]?.selected || false}
                  onChange={() => handleProductChange(product)}
                />
                <img src={product.image.src} alt={product.title} />
                <label htmlFor={`product-${product.id}`}>{product.title}</label>
              </div>

              {/* Render Variants if they exist */}
              {product.variants && product.variants.length > 0 && (
                <div className="variants-list">
                  {product.variants.map((variant) => (
                    <div className="checkbox-container" key={variant.id}>
                      <input
                        type="checkbox"
                        id={`variant-${variant.id}`}
                        name={`variant-${variant.id}`}
                        checked={
                          selectedItems[product.id]?.variants[variant.id] ||
                          false
                        }
                        onChange={() => handleProductChange(product, variant)}
                      />
                      <label htmlFor={`variant-${variant.id}`}>
                        {variant.title} - ${variant.price}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default SelectProduct;
