const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 border-t border-t-slate-300 fixed bottom-0 left-0 right-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left side */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Network. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex gap-4 text-sm flex-wrap justify-center md:justify-end">
          <a href="/about" className="hover:text-blue-600 transition">
            About
          </a>
          <a href="/privacy" className="hover:text-blue-600 transition">
            Privacy
          </a>
          <a href="/terms" className="hover:text-blue-600 transition">
            Terms
          </a>
          <a href="/contact" className="hover:text-blue-600 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
