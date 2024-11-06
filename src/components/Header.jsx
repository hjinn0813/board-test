// header

import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Header.scss';

export default function Header() {
  return (
    <header>
      <div className="header-btns">
        <Link to="/" className="header-link">
          <div className="header-txt">메인</div>
        </Link>
      </div>
      <div className="header-btns">
        <Link to="/board" className="header-link">
          <div className="header-txt">게시판</div>
        </Link>
      </div>
    </header>
  );
}
