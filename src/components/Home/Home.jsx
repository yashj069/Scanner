import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [showDownload, setShowDownload] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1000px)' });

  useEffect(() => {
    if (navigate) {
      const isAuth = sessionStorage.getItem('auth');
      if (!isAuth) navigate('/');
    }
  }, [navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };
  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    setVideo(file);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append('productName', name);
    image && postData.append('image', image);
    video && postData.append('video', video);
    setLoading(true);
    fetch(`https://guddi-garments.onrender.com/api/product/create`, {
      method: 'POST',
      body: postData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.productQr) {
          setQrImage(data.productQr);
          setShowDownload(true);
        } else setErrorMsg(data.message);
      })
      .catch(() => {
        setErrorMsg('Wrong email or password');
      });
  };

  const handleDownloadImage = async (imageUrl, filename) => {
    try {
      if (isTabletOrMobile) {
        const link = document.createElement('a');
        link.href = imageUrl; // Directly use the image URL
        link.download = filename; // Set the desired filename

        // Append the link to the document for mobile compatibility
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Cleanup
        document.body.removeChild(link);
      } else {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create a download link programmatically
        const link = document.createElement('a');
        link.href = isTabletOrMobile ? imageUrl : url;
        link.download = filename;

        // Mobile compatibility: Add to the document before clicking
        document.body.appendChild(link);

        // Simulate a click
        link.click();

        // Cleanup: Remove link and revoke URL
        document.body.removeChild(link);
        URL.revokeObjectURL(isTabletOrMobile ? imageUrl : url);
      }
    } catch (error) {
      console.error('Error downloading the image:', error);
      window.open(imageUrl, '_blank');
      // alert('Failed to download the image. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="App-header"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          class="mb-2"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '358px',
          }}
        >
          <label for="exampleFormControlInput1" class="form-label">
            Product Name
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Product Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div
          class="mb-2"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <label for="formFile" class="form-label">
            Upload Image
          </label>
          <input
            class="form-control"
            type="file"
            id="formFile"
            onChange={handleImageChange}
          />
        </div>

        <div
          class="mb-2"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <label for="formFile" class="form-label">
            Upload video
          </label>
          <input
            class="form-control"
            type="file"
            id="formFile"
            onChange={handleVideoChange}
          />
        </div>

        {showDownload && (
          <img
            src={qrImage}
            class="img-thumbnail"
            alt="QR"
            height={isTabletOrMobile ? '100px' : '200px'}
            width={isTabletOrMobile ? '100px' : '200px'}
            download="desired-filename.jpg"
          />
        )}

        {showDownload ? (
          <button
            type="button"
            class="btn btn-success"
            style={{ marginTop: '4px' }}
            onClick={() => handleDownloadImage(qrImage, 'NEW FILE')}
          >
            Download QR
          </button>
        ) : loading ? (
          <div class="spinner-border text-primary" role="status"></div>
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
            style={{ marginTop: '4px' }}
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
