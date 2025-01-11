import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { productId } = useParams();
  const [errorMsg, setErrorMsg] = useState(null);
  const [productData, setProductData] = useState(null);
  // const [localImage, setLocalImage] = useState(null);
  const [isImageClicked, setIsImageClicked] = useState(null);
  const [isVideoClicked, setIsVideoClicked] = useState(null);

  useEffect(() => {
    if (productId) {
      fetch(`https://guddi-garments.onrender.com/api/product/${productId}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.message) {
            setErrorMsg('Product details not available!');
          } else {
            setProductData(data.body);
            // const response = await fetch(data.body.productImage);
            // const blob = await response.blob();
            // // Convert Blob to Base64
            // const reader = new FileReader();
            // reader.onloadend = () => {
            //   setLocalImage(reader.result); // Base64 string
            // };
            // reader.readAsDataURL(blob);
          }
        })
        .catch(() => {
          setErrorMsg('Product details not available!');
        });
    }
  }, [productId]);

  const handleImageClick = () => {
    if (productData && productData.productImage) {
      setIsImageClicked(true);
    }
  };

  const handleVideoClick = () => {
    if (productData && productData.productVideo) {
      setIsVideoClicked(true);
    }
  };

  const handleBack = () => {
    setIsImageClicked(null);
    setIsVideoClicked(null);
  };

  return errorMsg ? (
    <div>{errorMsg} </div>
  ) : isImageClicked || isVideoClicked ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        gap: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          paddingLeft: '10px',
          paddingTop: '10px',
        }}
      >
        <button
          type="button"
          class="btn btn-primary"
          style={{ width: '100px' }}
          onClick={handleBack}
        >
          Back
        </button>
      </div>

      {isImageClicked ? (
        <img
          src={productData.productImage}
          alt="productImage"
          crossOrigin="anonymous"
          style={{
            maxWidth: '500px',
            maxHeight: '500px',
            objectFit: 'contain',
            margin: 'auto',
          }}
        />
      ) : (
        <video
          controls
          src={productData.productVideo}
          autoPlay
          style={{
            maxWidth: '500px',
            maxHeight: '500px',
            objectFit: 'contain',
            margin: 'auto',
          }}
        />
      )}
    </div>
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
