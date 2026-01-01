import { Link } from "react-router-dom";
import { BookOpen, Clock, BookMarked, Users, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "History",
    "Biography",
    "Arts",
    "Business",
  ];

  const rules = [
    "Members must show a valid library card to borrow books",
    "Maximum 3 books can be issued at a time",
    "Books must be returned within 14 days",
    "Late returns incur a fine of Rs 5 per day",
    "Lost or damaged books must be paid for",
    "Silence must be maintained in the library premises",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">City Library</h1>
          </div>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to City Library
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Your gateway to knowledge and learning. Explore thousands of books
          across various categories and expand your horizons.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            About Our Library
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookMarked className="text-blue-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Vast Collection</h4>
              <p className="text-gray-600">
                Access to over 10,000 books across various genres and subjects
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Community Focused</h4>
              <p className="text-gray-600">
                Serving the community with dedication for over 50 years
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Flexible Hours</h4>
              <p className="text-gray-600">
                Open 7 days a week to accommodate your schedule
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Book Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <BookOpen className="text-blue-600 mx-auto mb-2" size={24} />
              <h4 className="font-semibold text-gray-900">{category}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Rules Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Library Rules
          </h3>
          <div className="bg-white rounded-lg shadow-md p-8">
            <ul className="space-y-4">
              {rules.map((rule, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-blue-600 font-bold">{index + 1}.</span>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Opening Hours
        </h3>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-semibold text-gray-900">Monday - Friday</span>
              <span className="text-gray-600">9:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-semibold text-gray-900">Saturday</span>
              <span className="text-gray-600">10:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Sunday</span>
              <span className="text-gray-600">10:00 AM - 4:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 City Library. All rights reserved.</p>
          <p className="text-gray-400 mt-2">
            Contact: info@citylibrary.com | Phone: +977-1-4567890
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;