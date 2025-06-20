'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from "@/components/ui/Button";
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Patient',
    avatar: '/avatars/avatar-1.jpg',
    rating: 5,
    text: 'The SAFE platform has completely transformed how I manage my healthcare. Scheduling appointments is so easy, and I love having all my medical records in one secure place. The digital prescriptions feature is a game-changer!'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    role: 'Cardiologist',
    avatar: '/avatars/avatar-2.jpg',
    rating: 5,
    text: 'As a doctor, this platform has streamlined my workflow significantly. Patient management is intuitive, and the secure communication channel ensures I can provide timely care. The integration with other healthcare systems is seamless.'
  },
  {
    id: 3,
    name: 'Lisa Rodriguez',
    role: 'Pharmacist',
    avatar: '/avatars/avatar-3.jpg',
    rating: 4,
    text: 'Processing prescriptions has never been easier. The system helps prevent medication errors and allows me to communicate directly with doctors when needed. The inventory management tools are also incredibly helpful.'
  },
  {
    id: 4,
    name: 'Robert Williams',
    role: 'Patient',
    avatar: '/avatars/avatar-4.jpg',
    rating: 5,
    text: 'I manage healthcare for my elderly parents, and this platform makes it so much easier. The family account feature lets me coordinate appointments and medications efficiently. The reminders have been invaluable.'
  },
  {
    id: 5,
    name: 'Dr. Emily Taylor',
    role: 'Pediatrician',
    avatar: '/avatars/avatar-5.jpg',
    rating: 5,
    text: 'The platform is intuitive and helps me provide better care for my young patients. The medical history access and secure messaging with parents have improved communication tremendously. Highly recommended for all healthcare providers!'
  }
];
export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);
  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  const handleDotClick = (index) => {
    setAutoplay(false);
    setActiveIndex(index);
  };
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-br from-background to-muted/60"
    >
      {/* Soft background pattern/gradient */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 z-0" aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, var(--color-primary) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-semibold tracking-widest mb-2 text-xs md:text-sm uppercase">
              Testimonials
            </p>
            <h2 className="font-extrabold mb-2 text-3xl md:text-4xl text-foreground tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-2 text-base md:text-lg">
              Discover how our platform is making a difference in healthcare management
            </p>
          </motion.div>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="relative h-[420px] md:h-[320px] flex items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              {testimonials.map((testimonial, index) => (
                activeIndex === index && (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, scale: 0.96, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full h-full flex items-center justify-center"
                  >
                    <div className="relative bg-card border-2 border-primary/70 shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col h-full w-full max-w-xl mx-auto focus-within:ring-2 focus-within:ring-primary outline-none transition-all duration-300">
                      <Quote className="w-10 h-10 opacity-10 absolute top-6 left-6 text-primary" />
                      <p className="mb-6 text-lg md:text-xl italic relative z-10 text-card-foreground font-medium">
                        "{testimonial.text}"
                      </p>
                      <div className="mt-auto flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg border-4 border-background relative">
                          <motion.div
                            initial={{ boxShadow: '0 0 0 0 rgba(56,189,248,0.7)' }}
                            animate={{ boxShadow: '0 0 24px 4px rgba(56,189,248,0.25)' }}
                            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                            className="absolute inset-0 rounded-full z-0"
                          />
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover border-2 border-primary/30 relative z-10"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-card-foreground">
                            {testimonial.name}
                          </p>
                          <p className="text-muted-foreground text-sm font-medium">
                            {testimonial.role}
                          </p>
                          <div className="flex mt-1" aria-label={`Rating: ${testimonial.rating} out of 5`}>
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-center items-center mt-8 gap-3">
            <Button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="p-2 rounded-lg bg-card border border-border shadow hover:shadow-lg hover:bg-primary/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-lg border-2 border-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                    activeIndex === index ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="p-2 rounded-lg bg-card border border-border shadow hover:shadow-lg hover:bg-primary/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 