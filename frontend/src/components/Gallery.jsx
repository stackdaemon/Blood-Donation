import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Heart, Maximize2 } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      src: '/images/donor_smile.png',
      title: 'The Smile of a Lifesaver',
      desc: 'Every drop counts. A brave donor sharing a smile during our weekly collection camp, inspiring others to join.',
      location: 'Mirpur Donor Lounge',
      date: 'July 2026',
    },
    {
      id: 2,
      src: '/images/donation_camp.png',
      title: 'Community Collection Drive',
      desc: 'Our dedicated medical team and volunteers setting up a clean, safe space to facilitate seamless donor registrations.',
      location: 'Gulshan Civic Hall',
      date: 'June 2026',
    },
    {
      id: 3,
      src: '/images/hands_heart.png',
      title: 'Hands of Solidarity',
      desc: 'Volunteers and community members joining hands to form a symbol of love and unified support for emergency requests.',
      location: 'Dhaka Central Office',
      date: 'May 2026',
    },
    {
      id: 4,
      src: '/images/blood_bag.png',
      title: 'The Gift of Life',
      desc: 'Fully screened and verified blood units ready to be safely dispatched to local hospitals for critical surgical procedures.',
      location: 'Blood Bank Storage',
      date: 'Ongoing',
    },
    {
      id: 5,
      src: '/images/volunteer_group.png',
      title: 'Youth Volunteer Network',
      desc: 'A passionate group of student volunteers who coordinate communication and transport for emergency patient requests.',
      location: 'University Campus Hub',
      date: 'April 2026',
    },
    {
      id: 6,
      src: '/images/saving_lives.png',
      title: 'A Grateful Recipient',
      desc: 'A heartwarming smile from a recovery patient who received timely blood support through our quick-match network.',
      location: 'United Hospital Ward',
      date: 'March 2026',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-slate-100/60 overflow-hidden relative">
      {/* Decorative background blobs to enhance premium feel */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-full border border-rose-500/20">
            <Heart className="h-3.5 w-3.5 fill-rose-600 animate-pulse" />
            <span>Capturing Hope</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Gallery of Heroes
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Real moments from our community drives, dedicated volunteers, and patient recovery stories. See the life-saving impact of your generous contributions.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-12">
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              className="relative group cursor-pointer"
              // Small hover-lift animation
              whileHover={{
                y: -10,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
            >
              {/* Card Container */}
              <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full group">
                
                {/* Image Container with Hover Scale */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <motion.img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle vignette shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-65 pointer-events-none" />

                  {/* Expand / Maximize Hover Button */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-rose-500 hover:text-white"
                       onClick={(e) => {
                         e.stopPropagation();
                         setSelectedImage(item);
                       }}>
                    <Maximize2 className="h-4.5 w-4.5" />
                  </div>
                </div>

                {/* Content Overlay / Card Text */}
                <div className="p-6 flex flex-col flex-grow justify-between bg-white border-t border-slate-50">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Details row */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100/80 text-xs font-semibold text-slate-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-500/80" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-rose-500/80" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setSelectedImage(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800/10 flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-slate-950/65 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-rose-500 hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Lightbox Image */}
              <div className="w-full md:w-3/5 bg-slate-950 flex items-center justify-center relative aspect-video md:aspect-auto md:min-h-[480px]">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Lightbox Information Details */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-white text-slate-800">
                <div className="space-y-4">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-rose-50 text-rose-500 text-xs font-bold uppercase rounded-md border border-rose-100">
                    Hero Stories
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    {selectedImage.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {selectedImage.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-6 mt-6 border-t border-slate-100 text-sm font-semibold text-slate-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4.5 w-4.5 text-rose-500" />
                    <span>{selectedImage.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4.5 w-4.5 text-rose-500" />
                    <span>{selectedImage.date}</span>
                  </div>
                  
                  {/* Donation CTA in modal */}
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      // Scroll to hero or action zone
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full mt-4 py-3 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <Heart className="h-4.5 w-4.5 fill-current" />
                    <span>Be a Hero - Join Today</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
