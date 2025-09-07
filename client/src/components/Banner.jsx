import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

const bannerData = [
  {
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop",
    heading: "Raise Funds For",
    subheading: "Medical Emergencies",
    tagline: "Your small contribution can make a huge difference in someone's life.",
    buttonText: "Start a Fundraiser",
  },
  {
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
    heading: "Support a Cause",
    subheading: "You Believe In",
    tagline: "Empower communities and support social causes with 0% platform fees.",
    buttonText: "Explore Campaigns",
  },
  {
    image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=2070&auto=format&fit=crop",
    heading: "Help The Voiceless",
    subheading: "Support Animal Welfare",
    tagline: "Be a voice for those who cannot speak. Support animal shelters and rescue operations.",
    buttonText: "Donate for Animals",
  },
];

const Banner = () => {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 800,
        arrows: false,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <>
            <section className="relative w-full h-screen overflow-hidden">
                <Slider {...settings}>
                    {bannerData.map((item, idx) => (
                        <div key={idx} className="relative h-screen">
                            <img
                                src={item.image}
                                alt={item.heading}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-4">
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 [text-shadow:0_2px_4px_rgb(0_0_0_/_0.5)]">
                                    {item.heading} <span className="text-brand-secondary">{item.subheading}</span>
                                </h1>
                                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]">{item.tagline}</p>
                                <Link
                                    to="/start-campaign"
                                    className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
                                >
                                    {item.buttonText}
                                </Link>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            <style>{`
                /* Custom styles for slick-dots to use the new brand color */
                .slick-dots li button:before {
                    font-size: 12px;
                    color: white;
                    opacity: 0.6;
                    transition: all 0.3s ease;
                }

                .slick-dots li.slick-active button:before {
                    color: #F5D0A9; /* This is your brand-secondary color for high visibility */
                    opacity: 1;
                }
                
                .slick-slider {
                    height: 100vh;
                }

                .slick-slide > div {
                    height: 100vh;
                }
            `}</style>
        </>
    );
};

export default Banner;

