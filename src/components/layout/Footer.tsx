const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} PilotPro Calculator. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
