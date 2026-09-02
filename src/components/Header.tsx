import './Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="מאגר הלומדות — לדף הבית">
           <img
            className="site-header__logo site-header__logo--abraham"
            src="/wolf-logo.png"
            alt="סמינר ע״ש הרב י׳ א׳ וולף — מרכז הכשרה והשתלמויות"
          />
          <span className="site-header__divider" aria-hidden="true" />
         <img
            className="site-header__logo"
            src="/yecholot-logo.png"
            alt="יכולות — מרכז חדשנות וסימולציה"
          />
        </a>

        <nav className="site-header__nav">
          <a href="#catalog">קטלוג</a>
          <a className="btn btn--primary site-header__cta" href="#order">
            להזמנה
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
