import './Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="site-header__brand">
          {/*
            === מקום ללוגו ===
            להחלפה: הכניסו כאן <img src="/logo.png" alt="שם המוסד/הארגון" />
            ומחקו את ה-div הבא (logo-placeholder).
          */}
          <div className="logo-placeholder" aria-hidden="true">
            <span>לוגו</span>
          </div>
          <div className="site-header__titles">
            <h1>מאגר הלומדות</h1>
            <p>לומדות ומצגות דיגיטליות לבתי ספר יסודיים ועל-יסודיים</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
