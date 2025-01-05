import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { useMediaQuery } from 'react-responsive';

const Home = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [showDownload, setShowDownload] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [qrImage, setQrImage] = useState('');

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1000px)' });

  const handleDownload = () => {
    if (qrImage) window.open(qrImage, '_blank');
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append('productName', name);
    image && postData.append('image', image);
    video && postData.append('video', video);

    fetch('https://guddi-garments.vercel.app/api/product/create', {
      method: 'POST',
      body: postData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.productQr) {
          setQrImage(data.productQr);
          setShowDownload(true);
        } else setErrorMsg(data.message);
      })
      .catch(() => {
        setErrorMsg('Wrong email or password');
      });
  };

  return (
    <div>
      <Navbar />
      <div className="App-header">
        <div class="row g-3 align-items-center mr-8">
          <div class="col-auto">
            <label class="col-form-label">Product Name</label>
          </div>
          <div
            class="col-auto"
            style={{ width: isTabletOrMobile ? '200px' : '300px' }}
          >
            <input
              type="text"
              class="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div
          class="input-group mb-3"
          style={{ width: isTabletOrMobile ? '200px' : '400px' }}
        >
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="inputGroupFileAddon03"
          >
            Upload image
          </button>
          <input
            type="file"
            class="form-control form-control-sm"
            id="formFileSm"
            aria-describedby="inputGroupFileAddon03"
            aria-label="Upload"
            onChange={handleImageChange}
          />
        </div>

        <div
          class="input-group mb-3"
          style={{ width: isTabletOrMobile ? '200px' : '400px' }}
        >
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="inputGroupFileAddon03"
          >
            Upload video
          </button>
          <input
            type="file"
            class="form-control form-control-sm"
            id="formFileSm"
            aria-describedby="inputGroupFileAddon03"
            aria-label="Upload"
            onChange={(e) => setVideo(e.target.value)}
          />
        </div>

        {showDownload && (
          <img
            src={qrImage}
            class="img-thumbnail"
            alt="QR"
            height="200px"
            width="200px"
          />
        )}

        {showDownload ? (
          <button
            type="button"
            class="btn btn-success"
            onClick={handleDownload}
          >
            Download QR
          </button>
        ) : (
          <button
            type="button"
            class="btn btn-primary mt-4 mb-2"
            onClick={handleGenerate}
            disabled={!image && !video && !name}
          >
            Generate QR
          </button>
        )}
        {showDownload && (
          <button
            type="button"
            class="btn btn-success"
            onClick={() => window.location.reload()}
          >
            Create new
          </button>
        )}
        <h1 style={{ color: 'red' }}>{errorMsg}</h1>
      </div>
    </div>
  );
};

export default Home;
