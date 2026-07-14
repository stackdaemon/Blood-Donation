import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Regular Blood Donor',
      quote: 'Knowing that a single donation can save up to three lives is what keeps me coming back. The BloodLink app makes scheduling so simple!',
      rating: 5,
      avatar: '/images/avatar1.png',
    },
    {
      id: 2,
      name: 'Rahat Al-Mahmud',
      role: 'Leukemia Survivor',
      quote: 'During my chemotherapy, I needed multiple emergency platelet units. The donors on this platform literally saved my life. Thank you.',
      rating: 5,
      avatar: '/images/avatar2.png',
    },
    {
      id: 3,
      name: 'David Vance',
      role: 'Community Volunteer',
      quote: 'We organized a local drive in under 48 hours thanks to the automated matching notifications. It was an absolute success.',
      rating: 5,
      avatar: '/images/avatar3.png',
    },
    {
      id: 4,
      name: 'Dr. Emily Carter',
      role: 'Medical Advisor',
      quote: 'This platform is solving the critical blood shortage issue. The verification and compliance system is top-notch and secure.',
      rating: 5,
      avatar: '/images/avatar4.png',
    },
    {
      id: 5,
      name: 'Michael Chang',
      role: 'Platelet Donor',
      quote: 'The staff was incredibly friendly and professional. I felt completely comfortable during my donation and will definitely be back.',
      rating: 5,
      avatar: '/images/avatar1.png',
    },
    {
      id: 6,
      name: 'Ayesha Rahman',
      role: 'Thankful Mother',
      quote: 'My daughter received life-saving blood during her surgery. I cannot express enough gratitude to the anonymous hero donor.',
      rating: 5,
      avatar: '/images/avatar2.png',
    },
    {
      id: 7,
      name: 'James Thompson',
      role: 'First-time Donor',
      quote: "I was nervous about my first donation, but the app's prep guidelines and the warm volunteer staff made it a wonderful experience.",
      rating: 5,
      avatar: '/images/avatar3.png',
    },
    {
      id: 8,
      name: 'Fatima Khatun',
      role: 'Thalassemia Recipient',
      quote: 'Receiving blood transfusions twice a month keeps me healthy. Your donations give me the strength to study and follow my dreams.',
      rating: 5,
      avatar: '/images/avatar4.png',
    },
    {
      id: 9,
      name: 'Robert Kelly',
      role: 'Volunteer Driver',
      quote: 'Helping deliver blood bags to remote clinics in emergencies is rewarding. Seeing the impact of our network in real-time is amazing.',
      rating: 5,
      avatar: '/images/avatar1.png',
    },
    {
      id: 10,
      name: 'Sophia Martinez',
      role: 'Plasma Donor',
      quote: 'The tracking feature that notifies me when my blood donation is sent to a hospital and helps a patient is incredibly fulfilling.',
      rating: 5,
      avatar: '/images/avatar2.png',
    },
    {
      id: 11,
      name: 'Anisur Rahman',
      role: 'Emergency Coordinator',
      quote: 'Matching rare blood groups during emergencies used to take hours. Now, we broadcast alerts and connect with donors in minutes.',
      rating: 5,
      avatar: '/images/avatar3.png',
    },
    {
      id: 12,
      name: 'Olivia Campbell',
      role: 'Heart Surgery Patient',
      quote: 'During my open-heart bypass surgery, I needed 4 units of A+ blood. Thanks to this platform, the donor network matched me instantly.',
      rating: 5,
      avatar: '/images/avatar4.png',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // Update visible cards count responsively
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCards(1);
      } else if (width < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize(); // run on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSteps = testimonials.length - visibleCards + 1;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSteps);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, totalSteps]);

  // Ensure current index is kept in bounds if visible cards changes
  useEffect(() => {
    if (currentIndex >= totalSteps) {
      setCurrentIndex(Math.max(0, totalSteps - 1));
    }
  }, [visibleCards, totalSteps, currentIndex]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative vector background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100">
            <Heart className="h-3.5 w-3.5 fill-emerald-600 animate-pulse" />
            <span>Community Voices</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Stories of Hope & Courage
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Listen to the heartening experiences of our lifesavers and the brave recipients whose lives were forever transformed.
          </p>
        </div>

        {/* Carousel Slider Outer Wrapper */}
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Slider Window */}
          <div className="overflow-hidden py-4 -my-4">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 25 }}
            >
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  style={{ width: `${100 / visibleCards}%` }}
                  className="px-4 shrink-0"
                >
                  {/* Card Container */}
                  <motion.div
                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    className="bg-white border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-md hover:shadow-xl hover:border-rose-100 transition-all duration-300 flex flex-col justify-between h-full min-h-[300px] relative group"
                  >
                    {/* Quote Icon Background Accent */}
                    <div className="absolute top-6 right-6 text-slate-50 group-hover:text-rose-500/10 transition-colors duration-300">
                      <Quote className="h-10 w-10 rotate-180 fill-current" />
                    </div>

                    {/* Rating and Quote Text */}
                    <div className="space-y-4 relative z-10">
                      <div className="flex space-x-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-600 text-sm sm:text-base italic leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center space-x-3.5 pt-6 mt-6 border-t border-slate-100 relative z-10">
                      <div className="h-11 w-11 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-xs">
                        <h4 className="font-extrabold text-slate-800 text-sm">
                          {item.name}
                        </h4>
                        <span className="text-rose-500 font-bold tracking-wide uppercase mt-0.5 block">
                          {item.role}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            aria-label="Previous Testimonials"
            className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-6 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-500 border border-slate-100 hover:border-rose-100 p-2.5 sm:p-3.5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer z-20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Testimonials"
            className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-6 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-500 border border-slate-100 hover:border-rose-100 p-2.5 sm:p-3.5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer z-20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Carousel Indicators (Dots) */}
        <div className="flex justify-center items-center space-x-1.5 pt-2 max-w-lg mx-auto flex-wrap gap-y-2">
          {[...Array(totalSteps)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-rose-500 w-6'
                  : 'bg-slate-300 hover:bg-slate-400 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
