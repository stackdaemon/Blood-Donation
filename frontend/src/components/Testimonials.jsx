import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left slide, 1 for right slide
  const [isHovered, setIsHovered] = useState(false);

  // Handle slide transitions
  const slideTo = (index, slideDirection) => {
    setDirection(slideDirection);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    slideTo(nextIndex, 1);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    slideTo(prevIndex, -1);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered]);

  // Framer Motion variants for slide effects
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Visual background accents */}
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

        {/* Carousel Container */}
        <div 
          className="max-w-4xl mx-auto px-2 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Active Testimonial Card */}
          <div className="relative min-h-[360px] sm:min-h-[280px] md:min-h-[240px] flex items-center">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={`w-full bg-white border p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row gap-8 items-center relative overflow-hidden transition-all duration-300 ${
                  isHovered
                    ? 'border-rose-200 shadow-2xl shadow-rose-500/5 scale-[1.005]'
                    : 'border-slate-100 shadow-xl'
                }`}
              >
                {/* Quote Icon Background Accent */}
                <div className="absolute -top-4 -right-4 text-slate-50/70 pointer-events-none">
                  <Quote className="h-32 w-32 rotate-180 fill-current" />
                </div>

                {/* User Avatar */}
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-rose-500/20 bg-slate-50 shrink-0 shadow-inner relative z-10">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Testimonial Quote & Info */}
                <div className="space-y-4 flex-grow relative z-10 text-center md:text-left">
                  {/* Rating Stars */}
                  <div className="flex justify-center md:justify-start space-x-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote Body */}
                  <p className="text-slate-600 text-base sm:text-lg italic leading-relaxed font-medium">
                    "{testimonials[currentIndex].quote}"
                  </p>

                  {/* Donor Info details */}
                  <div className="pt-2">
                    <h4 className="font-extrabold text-slate-800 text-base">
                      {testimonials[currentIndex].name}
                    </h4>
                    <span className="text-rose-500 font-bold tracking-wide uppercase mt-0.5 text-xs block">
                      {testimonials[currentIndex].role}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous Testimonial"
            className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-6 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-500 border border-slate-100 hover:border-rose-100 p-2.5 sm:p-3.5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer z-20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Testimonial"
            className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-6 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-500 border border-slate-100 hover:border-rose-100 p-2.5 sm:p-3.5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer z-20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Carousel Indicators (Dots) */}
        <div className="flex justify-center items-center space-x-2 pt-2">
          {testimonials.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => slideTo(idx, idx > currentIndex ? 1 : -1)}
              aria-label={`Go to testimonial ${idx + 1}`}
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
