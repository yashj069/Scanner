import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';

const Home = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [showDownload, setShowDownload] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [qrImage, setQrImage] = useState('');

  const handleDownload = () => {
    window.open('', '_self');
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setName('');
    setImage(null);
    setVideo(null);
    setShowDownload(false);
    setErrorMsg('');
    setQrImage('');
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
          <div class="col-auto" style={{ width: '300px' }}>
            <input
              type="text"
              class="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div class="input-group mb-3" style={{ width: '400px' }}>
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="inputGroupFileAddon03"
          >
            Upload image
          </button>
          <input
            type="file"
            class="form-control"
            id="inputGroupFile03"
            aria-describedby="inputGroupFileAddon03"
            aria-label="Upload"
            onChange={handleImageChange}
          />
        </div>

        <div class="input-group mb-3" style={{ width: '400px' }}>
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="inputGroupFileAddon03"
          >
            Upload video
          </button>
          <input
            type="file"
            class="form-control"
            id="inputGroupFile03"
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
            class="btn btn-primary mt-4"
            onClick={handleGenerate}
            disabled={!image && !video && !name}
          >
            Generate QR
          </button>
        )}
        {showDownload && (
          <button type="button" class="btn btn-success" onClick={handleReset}>
            Create new
          </button>
        )}
        <h1 style={{ color: 'red' }}>{errorMsg}</h1>
      </div>
    </div>
  );
};

export default Home;
