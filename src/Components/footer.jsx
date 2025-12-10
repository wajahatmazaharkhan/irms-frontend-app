import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="text-gray-800 bg-white border-t border-gray-200 mt-60 dark:text-gray-100 dark:bg-slate-900 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-screen-xl px-4 py-5 mx-auto sm:px-6 lg:px-40">
        <div className="grid grid-cols-1 mt-12 text-sm sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8 sm:text-base">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Company</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/aboutus"
                  className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Help</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/contact-support"
                  className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Legal</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/termsandconditions"
                  className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacypolicy"
                  className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Follow Us</p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center space-x-2 pt-2">
                <FontAwesomeIcon icon={faFacebook} className="w-5 h-5 text-blue-600" />
                <span className="text-gray-800 dark:text-gray-100">Facebook</span>
              </li>
              <li className="flex items-center space-x-2 pt-2">
                <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5 text-blue-700" />
                <span className="text-gray-800 dark:text-gray-100">LinkedIn</span>
              </li>
              <li className="flex items-center space-x-2 pt-2">
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 text-pink-500" />
                <span className="text-gray-800 dark:text-gray-100">Instagram</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-200 sm:text-center dark:border-slate-700">
          <div className="sm:flex sm:justify-between">
            <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
              &copy; 2026 Intern Resource Management. All rights reserved.
            </p>
            <ul className="flex flex-wrap justify-start gap-6 mt-2 text-xs sm:mt-0 sm:text-sm lg:justify-end">
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacypolicy"
                  className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;