import React, { useRef } from "react";
import { FaHeart, FaUsers, FaChartLine } from "react-icons/fa";

const helpOptions = [
  {
    title: "Education",
    description:
      "Empowering minds through quality education and learning opportunities",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Disaster Relief",
    description: "Providing immediate aid and support during natural disasters",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Food & Nutrition",
    description: "Fighting hunger and malnutrition in underserved communities",
    image:
      "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Environment",
    description: "Protecting our planet for future generations",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Animal Welfare",
    description: "Protecting and caring for animals in need",
    image:
      "https://images.unsplash.com/photo-1496180727794-817822f65950?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Child Protection",
    description: "Ensuring safety and rights of children worldwide",
    image:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Community Development",
    description: "Empowering local communities to thrive",
    image:
      "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=800&q=80",
  },
];

const Help = () => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <section className="bg-white py-12 px-4 sm:px-6 lg:px-20 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          Some Ways You Can Help
        </h2>
        <p className="text-lg text-gray-700 mb-10">
          Choose a cause that matters to you and make a difference today.
        </p>

        <div className="flex items-center justify-center space-x-4">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 shadow"
          >
            <span className="text-xl">←</span>
          </button>

          {/* Cards container */}
          <div
            ref={containerRef}
            className="flex space-x-6 overflow-x-auto overflow-y-hidden scrollbar-hide w-full max-w-[1000px] px-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {helpOptions.map((option, index) => (
              <div
                key={index}
                className="group relative flex-shrink-0 w-56 sm:w-64 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl">
                    <button
                      className="bg-green-600 text-sm text-white px-1 py-1 rounded-sm hover:bg-green-900"
                      aria-label={`Donate to ${option.title}`}
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-green-600 font-semibold text-lg mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 shadow"
          >
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Explore More Button */}
        <div className="mt-10">
          <button className="px-6 py-3 text-green-600 border border-green-600 rounded-xl hover:bg-green-50 transition">
            Explore More
          </button>
        </div>
      </section>

      {/* Impact Section full width, no horizontal padding */}
      <section className="bg-green-500 mt-4 py-12 rounded-xl text-white">
        <h3 className="text-2xl sm:text-3xl font-semibold mb-10 text-center">
          Our Impact Together
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center max-w-[1000px] mx-auto px-4">
          <div>
            <FaHeart className="text-4xl mx-auto mb-2" />
            <div className="text-4xl font-bold">12,500</div>
            <div className="text-lg mt-2">Meals Served</div>
            <p className="text-sm mt-1">Fed families in need</p>
          </div>
          <div>
            <FaUsers className="text-4xl mx-auto mb-2" />
            <div className="text-4xl font-bold">7,800</div>
            <div className="text-lg mt-2">Active Donors</div>
            <p className="text-sm mt-1">Compassionate supporters</p>
          </div>
          <div>
            <FaChartLine className="text-4xl mx-auto mb-2" />
            <div className="text-4xl font-bold">₹35L</div>
            <div className="text-lg mt-2">Total Raised</div>
            <p className="text-sm mt-1">Funding real change</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Help;
