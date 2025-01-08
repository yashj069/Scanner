import React from 'react';
import { useMediaQuery } from 'react-responsive';

const Navbar = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1000px)' });
  return (
    <div>
      <nav
        class="navbar navbar-expand-lg navbar-light bg-light"
        style={{
          height: '44px',
          alignItems: 'center',
        }}
      >
        <div id="navbarSupportedContent">
          <ul
            class="navbar-nav me-auto mb-2 mb-lg-0"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: isTabletOrMobile ? '20px' : '10px',
              paddingLeft: '20px',
            }}
          >
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/home">
                Create
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/update">
                Update
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
