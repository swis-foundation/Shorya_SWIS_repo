import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// const bannerData = [
//   {
//     image:
//       "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1920&q=80",
//     heading: "Empowering",
//     subheading: "Communities Together",
//     tagline: "Together we grow stronger",
//     buttonText: "Explore",
//     link: "/explore",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1920&q=80",
//     heading: "Building",
//     subheading: "Brighter Futures",
//     tagline: "Make an impact today",
//     buttonText: "Get Involved",
//     link: "/get-involved",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1617003657420-7fbb5c3ed6c4?auto=format&fit=crop&w=1920&q=80",
//     heading: "Inspiring",
//     subheading: "Change Daily",
//     tagline: "Join our mission for good",
//     buttonText: "Support Now",
//     link: "/support",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1603575448366-599de7b62a98?auto=format&fit=crop&w=1920&q=80",
//     heading: "Feeding",
//     subheading: "The Hungry",
//     tagline: "Every meal matters",
//     buttonText: "Donate Now",
//     link: "/donate",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1920&q=80",
//     heading: "Educating",
//     subheading: "Future Leaders",
//     tagline: "Education is empowerment",
//     buttonText: "Volunteer",
//     link: "/volunteer",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1629212173186-3c8d186b7c6c?auto=format&fit=crop&w=1920&q=80",
//     heading: "Healing",
//     subheading: "Through Care",
//     tagline: "Your help brings hope",
//     buttonText: "Care With Us",
//     link: "/care",
//   },
// ];

const bannerData = [
  {
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1920&q=80",
    heading: "Empowering",
    subheading: "Communities Together",
    tagline: "Together we grow stronger",
    buttonText: "Explore",
    link: "/explore",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1920&q=80",
    heading: "Building",
    subheading: "Brighter Futures",
    tagline: "Make an impact today",
    buttonText: "Get Involved",
    link: "/get-involved",
  },
  {
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80",
    heading: "Inspiring",
    subheading: "Change Daily",
    tagline: "Join our mission for good",
    buttonText: "Support Now",
    link: "/support",
  },

  {
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80",
    heading: "Educating",
    subheading: "Future Leaders",
    tagline: "Education is empowerment",
    buttonText: "Volunteer",
    link: "/volunteer",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503437313881-503a91226402?auto=format&fit=crop&w=1920&q=80",
    heading: "Healing",
    subheading: "Through Care",
    tagline: "Your help brings hope",
    buttonText: "Care With Us",
    link: "/care",
  },
];

export default function Banner() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 600,
    arrows: false,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <section className="banner-section">
        <Slider {...settings} className="banner-slider">
          {bannerData.map((item, idx) => (
            <div key={idx} className="banner-slide">
              <img
                src={item.image}
                alt={item.heading}
                loading="lazy"
                className="banner-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/1920x1080?text=Image+Not+Found";
                }}
              />
              <div className="banner-overlay">
                <h1 className="banner-heading">
                  {item.heading} <span>{item.subheading}</span>
                </h1>
                <p className="banner-tagline">{item.tagline}</p>
                <a href={item.link} className="banner-button">
                  {item.buttonText}
                </a>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <style>{`
        .banner-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        .banner-slider, .banner-slide {
          height: 100vh !important;
        }
        .banner-slide {
          position: relative;
          width: 100vw;
        }
        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .banner-overlay {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 1rem;
          box-sizing: border-box;
        }
        .banner-heading {
          font-weight: 700;
          font-size: 3vw;
          max-width: 90vw;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        .banner-heading span {
          color: #22c55e;
        }
        .banner-tagline {
          font-size: 1.5vw;
          max-width: 600px;
          margin-bottom: 2rem;
        }
        .banner-button {
          background-color: #22c55e;
          color: white;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1.5vw;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }
        .banner-button:hover {
          background-color: #16a34a;
        }

        .banner-slider .slick-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex !important;
          justify-content: center;
          width: auto;
          z-index: 10;
        }

        .banner-slider .slick-dots li button:before {
          font-size: 12px;
          color: white;
          opacity: 0.7;
        }

        .banner-slider .slick-dots li.slick-active button:before {
          color: #22c55e;
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .banner-heading {
            font-size: 4vw;
          }
          .banner-tagline {
            font-size: 2.5vw;
          }
          .banner-button {
            font-size: 2.5vw;
            padding: 0.75rem 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .banner-heading {
            font-size: 5vw;
          }
          .banner-tagline {
            font-size: 3.5vw;
          }
          .banner-button {
            font-size: 3.5vw;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
    </>
  );
}
