import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>© {new Date().getFullYear()} מאגר הלומדות. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
};

export default Footer;
