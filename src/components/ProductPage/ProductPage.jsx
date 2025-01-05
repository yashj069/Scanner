import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { productId } = useParams();
  const [errorMsg, setErrorMsg] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (productId) {
      fetch(`https://guddi-garments.vercel.app/api/product/${productId}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setErrorMsg('Product details not available!');
          } else setProductData(data.body);
        })
        .catch(() => {
          setErrorMsg('Product details not available!');
        });
    }
  }, [productId]);

  const handleImageClick = () => {
    if (productData && productData.productImage) {
      window.open(productData.productImage, '_blank');
    }
  };

  const handleVideoClick = () => {
    if (productData && productData.productVideo) {
      window.open(productData.productVideo, '_blank');
    }
  };

  return errorMsg ? (
    <div>{errorMsg} </div>
  ) : (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '20px',
      }}
    >
      <button
        type="button"
        class="btn btn-success"
        onClick={handleImageClick}
        disabled={!productData || !productData.productImage}
      >
        Show Image
      </button>
      <button
        type="button"
        class="btn btn-success"
        onClick={handleVideoClick}
        disabled={!productData || !productData.productVideo}
      >
        Show Video
      </button>
    </div>
  );
};

export default ProductPage;
