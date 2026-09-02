import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
         
          <img
            className="site-footer__logo--abraham"
            src="/wolf-logo.png"
            alt="סמינר ע״ש הרב י׳ א׳ וולף — מרכז הכשרה והשתלמויות"
          />
           <img src="/yecholot-logo.png" alt="יכולות — מרכז חדשנות וסימולציה" />
        </div>

        <p className="site-footer__tagline">
          מאגר הלומדות · מרכז חדשנות וסימולציה מבית סמינר הרב וולף   
        </p>

        <p className="site-footer__copy">
          © {new Date().getFullYear()} כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;
