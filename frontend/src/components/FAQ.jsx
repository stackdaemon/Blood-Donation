import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Heart } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      id: 1,
      question: 'Who can donate blood?',
      answer: 'Most people can donate blood if they are in good general health, weigh at least 110 lbs (50 kg), and are between 17 and 65 years old. A quick health screening before your donation will confirm your immediate eligibility.',
    },
    {
      id: 2,
      question: 'How often can I donate?',
      answer: 'You can donate whole blood every 56 days (approximately 8 weeks) to allow your body to replenish red blood cells. Platelet donations can be made every 7 days (up to 24 times a year), and double red cell donations can be made every 112 days.',
    },
    {
      id: 3,
      question: 'Is the blood donation process safe?',
      answer: 'Yes, donating blood is completely safe. All collection equipment (needles, tubes, bags) is sterile, brand new, and discarded immediately after a single use. There is absolutely no risk of contracting any blood-borne infections.',
    },
    {
      id: 4,
      question: 'How long does the entire process take?',
      answer: 'The actual blood extraction takes only about 8 to 10 minutes. However, the complete visit—including registration, a quick health checkup, the donation itself, and 15 minutes of rest with snacks—takes around 45 to 60 minutes.',
    },
    {
      id: 5,
      question: 'What should I do to prepare for my donation?',
      answer: "Get a good night's sleep, eat a healthy, low-fat meal before your appointment, and drink plenty of water (approx. 500ml) beforehand. Avoid drinking alcohol 24 hours prior to donation and stay hydrated after you finish.",
    },
  ];

  // Framer Motion variants for scroll-triggered fade in
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Decorative vector background */}
      <div className="absolute top-1/3 left-1/10 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-4xl mx-auto space-y-16"
      >
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-full border border-rose-100">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Everything you need to know about the blood donation process, safety guidelines, and preparing for your appointment.
          </p>
        </div>

        {/* DaisyUI Collapse Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="collapse collapse-plus border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-2xl hover:border-rose-200 transition-all duration-200 shadow-sm"
            >
              {/* Radio input handles accordion state (only one open at a time) */}
              <input
                type="radio"
                name="blood-donation-faq"
                defaultChecked={index === 0}
                className="peer cursor-pointer"
              />
              
              {/* Question Header */}
              <div className="collapse-title text-base sm:text-lg font-bold text-slate-800 peer-checked:text-rose-600 transition-colors pr-12 py-5 pl-6 sm:pl-8">
                {faq.question}
              </div>

              {/* Answer Content */}
              <div className="collapse-content pl-6 sm:pl-8 pr-8 text-sm sm:text-base text-slate-600 leading-relaxed pb-5">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action footer */}
        <div className="text-center pt-4">
          <p className="text-sm font-semibold text-slate-400">
            Still have questions? Check out our{' '}
            <a href="mailto:support@bloodlink.org" className="text-rose-500 hover:text-rose-600 underline">
              Support Center
            </a>{' '}
            or email us.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
