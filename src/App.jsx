import { useState } from "react";
import AddProduct from "./components/AddProduct";
import { useAppContext } from "./context/AppContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const { products, setProducts } = useAppContext();
  const [showAddProduct, setShowAddProduct] = useState(false);

  const onDeleteProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };


  const onDragEnd = (result) => {
    // If there's no destination, do nothing
    if (!result.destination) return;

    
    const reorderedProducts = Array.from(products);

    
    const [movedProduct] = reorderedProducts.splice(result.source.index, 1);

 
    reorderedProducts.splice(result.destination.index, 0, movedProduct);

    setProducts(reorderedProducts);
  };

  return (
    <>
      Add Products
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="products">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {products?.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <AddProduct
                        index={index}
                        itemOfProduct={item}
                        onDeleteProduct={onDeleteProduct}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {products.length === 0 && (
        <AddProduct
          index={0}
          itemOfProduct={{}}
          onDeleteProduct={onDeleteProduct}
        />
      )}
      {showAddProduct && (
        <AddProduct
          index={1}
          itemOfProduct={{}}
          onDeleteProduct={onDeleteProduct}
        />
      )}
      <button
        onClick={() => setShowAddProduct((prev) => !prev)}
        className="add-product-btn"
      >
        Add Product
      </button>
    </>
  );
}

export default App;
