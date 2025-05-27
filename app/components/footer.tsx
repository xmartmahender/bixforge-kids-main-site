'use client';

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaHeart,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebookF, url: 'https://facebook.com', color: 'hover:text-blue-500' },
    { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: FaLinkedinIn, url: 'https://linkedin.com', color: 'hover:text-blue-600' },
    { name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com', color: 'hover:text-red-500' },
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Help Center', href: '/help' },
  ];

  const contentLinks = [
    { name: 'Home', href: '/' },
    { name: 'Code Stories', href: '/code-stories' },
    { name: 'Code Videos', href: '/code-videos' },
    { name: 'Poems', href: '/poems' },
    { name: 'Parents Guide', href: '/parents' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"></div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/10 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-pink-500/10 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-purple-400/10 rounded-full animate-ping"></div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <span className="text-4xl">🌟</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  BixForge Solutions
                </span>
                <p className="text-sm text-purple-200 mt-1">Learning Made Fun!</p>
              </div>
            </Link>

            <p className="text-purple-200 text-sm leading-relaxed mb-4">
              Creating magical learning experiences for children through interactive stories,
              coding adventures, and creative content that sparks imagination and curiosity.
            </p>

            <div className="flex items-center space-x-2 text-sm text-purple-200">
              <FaHeart className="text-pink-400 animate-pulse" />
              <span>Made with love for kids worldwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center">
              <span className="mr-2">🔗</span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-purple-200 hover:text-yellow-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Links */}
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Explore Content
            </h3>
            <ul className="space-y-3">
              {contentLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-purple-200 hover:text-yellow-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center">
              <span className="mr-2">📞</span>
              Connect With Us
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-purple-200 text-sm">
                <FaEnvelope className="mr-3 text-yellow-400" />
                <span>hello@bixforge.com</span>
              </div>
              <div className="flex items-center text-purple-200 text-sm">
                <FaPhone className="mr-3 text-yellow-400" />
                <span>+1 (555) 123-KIDS</span>
              </div>
              <div className="flex items-center text-purple-200 text-sm">
                <FaMapMarkerAlt className="mr-3 text-yellow-400" />
                <span>BixForge Solutions HQ</span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm text-purple-200 mb-3">Follow our adventures:</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        w-10 h-10 bg-purple-700/50 rounded-full flex items-center justify-center
                        text-purple-200 hover:text-white transition-all duration-300 transform hover:scale-110
                        hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600
                        ${social.color}
                      `}

                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-purple-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-purple-200 text-sm">
                © 2025 BixForge Solutions — Kidz Zone. All rights reserved.
              </p>
              <p className="text-purple-300 text-xs mt-1">
                Empowering young minds through technology and creativity
              </p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-purple-200">
              <span>Crafted with</span>
              <FaHeart className="text-pink-400 animate-pulse" />
              <span>by</span>
              <span className="text-yellow-400 font-bold">
                BixForge Solutions
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
