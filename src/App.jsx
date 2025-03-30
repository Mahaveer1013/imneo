import { useState, useMemo } from 'react';
import imagesData from './images.json';

const App = () => {
  const [expandedTitles, setExpandedTitles] = useState([]);

  // Memoized data processing to avoid unnecessary recalculations
  const processedData = useMemo(() => {
    const seenTitles = new Set();
    return imagesData.reduce((acc, doc) => {
      if (!seenTitles.has(doc.title)) {
        seenTitles.add(doc.title);
        const pages = Array.from({ length: doc.pages }, (_, i) => ({
          id: i + 1,
          pageNumber: i + 1,
          imageUrl: `/images/${doc.title}/${i + 1}.png`
        }));
        acc.push({ ...doc, pages });
      }
      return acc;
    }, []);
  }, [imagesData]);

  const toggleExpand = (title) => {
    setExpandedTitles(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleImageClick = (imageUrl) => {
    const newWindow = window.open('', '_blank', 'noopener,noreferrer');
    newWindow.location.href = imageUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Interactive Document Gallery
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through categorized documents with high-quality previews
          </p>
        </header>

        <div className="space-y-8">
          {processedData.map((doc) => (
            <div 
              key={doc.title} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div
                className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 select-none transition-colors duration-200"
                onClick={() => toggleExpand(doc.title)}
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {doc.title}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {doc.pages.length} {doc.pages.length === 1 ? 'page' : 'pages'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {doc.pages.length} {doc.pages.length === 1 ? 'Item' : 'Items'}
                  </span>
                  <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
                      expandedTitles.includes(doc.title) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedTitles.includes(doc.title) && (
                <div className="p-6 pt-0 border-t">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {doc.pages.map((page) => (
                      <div
                        key={`${doc.title}-${page.pageNumber}`}
                        className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-md">
                          Pg. {page.pageNumber}
                        </div>
                        <div
                          className="cursor-zoom-in relative aspect-[4/5]"
                          onClick={() => handleImageClick(page.imageUrl)}
                        >
                          <img
                            src={page.imageUrl}
                            alt={`${doc.title} - Page ${page.pageNumber}`}
                            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.src = '/images/placeholder.png';
                              e.target.alt = 'Image not available';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white font-medium">
                              Click to view full size
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <p className="text-sm font-medium text-gray-700">
                            {doc.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Page {page.pageNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;