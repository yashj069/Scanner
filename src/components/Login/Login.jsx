import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append('email', email);
    postData.append('password', password);
    fetch(`https://guddi-garments.onrender.com/api/auth/login`, {
      method: 'POST',
      body: postData,
    })
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem('auth', true);
          navigate('/home');
        } else res.json();
      })
      .then((data) => {
        setErrorMsg(data.message);
      })
      .catch(() => {
        setErrorMsg('Wrong email or password');
      });
  };

  return (
    <div className=" App-header">
      <form>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" class="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
        <h1 style={{ color: 'red' }}>{errorMsg}</h1>
      </form>
    </div>
  );
};

export default Login;
