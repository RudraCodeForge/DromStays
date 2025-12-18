import Logo from "../../components/Logo.jsx";
const PageNotFound = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      <header className="d-flex align-items-center p-3 border-bottom bg-white">
        <Logo />
      </header>
      {/* Main Content */}
      <main className="flex-grow d-flex flex-column justify-content-center align-items-center text-center p-4">
        {/* Image */}
        <div className="mb-4" style={{ maxWidth: "300px", width: "100%" }}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBybFqtIdQCAAKfI7hO1JRn00SP1iBbJ1YtjC2V6vENJziDSlePiDkjz1jfQMq7QXKy5oEr8o9FpePqoj3wBowlRbctNGqUSwvX6qH1jkd9W0A-NFkFGyGabDfNxUtzmfEPt2WpfdeYkvkdftpF65Cnl211Y3u-4z79ut_9nKvlba9zP3RgQcz8Ilk3PPHR-n-AuE202aEUg2DDxhS5Y46K2qGW5o4IhzUO_8R7NLw_pE8VniYwt7jUShorvhJoUCDxS1CxojIdJcVn"
            alt="404 Illustration"
            className="img-fluid"
          />
        </div>

        {/* Headline */}
        <h1 className="display-4 fw-bold">404 - Page Not Found</h1>

        {/* Body Text */}
        <p className="lead text-secondary mb-4">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Button */}
        <a href="/" className="btn btn-primary btn-lg">
          Go to Homepage
        </a>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top mt-auto py-3">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0 text-muted">
            © 2026 DromStays. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <a href="#" className="text-decoration-none text-muted">
              Help Center
            </a>
            <a href="#" className="text-decoration-none text-muted">
              Contact Us
            </a>
            <a href="#" className="text-decoration-none text-muted">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageNotFound;
