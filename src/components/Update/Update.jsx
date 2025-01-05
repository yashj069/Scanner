import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';

const Update = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const getProducts = () => {
    fetch('https://guddi-garments.vercel.app/api/product/', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.body);
        setOriginalData(data.body);
      })
      .catch(() => {
        setErrorMsg('Wrong email or password');
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const renderToast = () => {
    return (
      <div
        class="toast align-items-center"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">Product Updated Successfully!</div>
          <button
            type="button"
            class="btn-close me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    );
  };

  const handleUpdateProductData = (productId, productIdx) => {
    const postData = new FormData();
    postData.append('productName', data[productIdx].productName);
    postData.append('image', data[productIdx].productImage);
    postData.append('video', data[productIdx].productVideo);
    postData.append('isEnabled', data[productIdx].isEnabled);

    fetch(`https://guddi-garments.vercel.app/api/product/update/${productId}`, {
      method: 'POST',
      body: postData,
    })
      .then(() => renderToast())
      .catch(() => {
        setErrorMsg('Failed to delete product');
      });
  };

  const handleIsEnableChange = (productIdx) => {
    setData((prevData) =>
      prevData.map((item, idx) =>
        idx === productIdx ? { ...item, isEnabled: !item.isEnabled } : item
      )
    );
  };

  const handleProductNameChange = (productIdx, newProductName) => {
    setData((prevData) =>
      prevData.map((item, idx) =>
        idx === productIdx
          ? {
              ...item,
              productName:
                newProductName === ''
                  ? originalData[productIdx].productName
                  : newProductName,
            }
          : item
      )
    );
  };

  const handleProductImageChange = (event, productIdx) => {
    const newImage = event.target.files[0];
    if (newImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setData((prevData) =>
          prevData.map((item, idx) =>
            idx === productIdx
              ? {
                  ...item,
                  updatedImage: e.target.result,
                  productImage: newImage,
                }
              : item
          )
        );
        // setImageSrc(e.target.result); // Set the image source to the file's data URL
      };
      reader.readAsDataURL(newImage); // Read the file as a data URL
    }
  };

  const handleProductVideoChange = (event, productIdx) => {
    const newVideo = event.target.files[0];
    if (newVideo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setData((prevData) =>
          prevData.map((item, idx) =>
            idx === productIdx
              ? { ...item, updatedVideo: newVideo, productVideo: newVideo }
              : item
          )
        );
      };
      reader.readAsDataURL(newVideo); // Read the file as a data URL
    }
  };

  const renderData = () => {
    return (
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Product Name</th>
            <th scope="col">Image</th>
            <th scope="col">Video</th>
            <th scope="col">Qr Image</th>
            <th scope="col">isEnabled</th>
            <th scope="col">Save Changes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            return (
              <tr>
                {' '}
                <th scope="row">{idx + 1}</th>
                <td>
                  <input
                    class="form-control"
                    type="text"
                    placeholder={item.productName}
                    onChange={(e) =>
                      handleProductNameChange(idx, e.target.value)
                    }
                  />
                </td>
                <td>
                  <img
                    src={item.updatedImage || item.productImage}
                    class="img-thumbnail"
                    alt="productImage"
                    height="100px"
                    width="100px"
                  />
                  <input
                    class="form-control form-control-sm"
                    id="formFileSm"
                    type="file"
                    onChange={(event) => handleProductImageChange(event, idx)}
                    style={{ width: '200px' }}
                  />
                </td>
                <td>
                  {item.productVideo ? (
                    <video
                      src={item.updatedVideo || item.productVideo}
                      alt="productImage"
                      controls
                      height="100px"
                      width="100px"
                    />
                  ) : (
                    'Not Available'
                  )}
                  <input
                    class="form-control form-control-sm"
                    id="formFileSm"
                    type="file"
                    onChange={(event) => handleProductVideoChange(event, idx)}
                    style={{ width: '200px' }}
                  />
                </td>
                <td>
                  <img
                    src={item.productQr}
                    class="img-thumbnail"
                    alt="productQr"
                    height="100px"
                    width="100px"
                  />
                </td>
                <td>
                  <div
                    class="form-check form-switch"
                    style={{
                      cursor: 'pointer',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckChecked"
                      checked={item.isEnabled}
                      style={{
                        cursor: 'pointer',
                        alignItems: 'center !important',
                        justifyContent: 'center',
                      }}
                      onChange={() => handleIsEnableChange(idx)}
                    />
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => handleUpdateProductData(item.productId, idx)}
                    disabled={
                      JSON.stringify(originalData[idx]) === JSON.stringify(item)
                    }
                  >
                    Save
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <Navbar />
      {renderData()}
    </div>
  );
};

export default Update;
