'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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
      }, 5000);
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
      className="relative overflow-hidden py-8 md:py-12 bg-muted"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.4'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-semibold tracking-wider mb-2">
              TESTIMONIALS
            </p>
            <h2 className="font-bold mb-2 text-3xl md:text-4xl text-foreground">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
              Discover how our platform is making a difference in healthcare management
            </p>
          </motion.div>
        </div>
        <div className="relative max-w-3xl mx-auto">
          
          <div className="relative h-[400px] md:h-[300px] overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  position: activeIndex === index ? 'relative' : 'absolute',
                }}
                transition={{ duration: 0.5 }}
                className="w-full h-full top-0 left-0"
                style={{
                  visibility: activeIndex === index ? 'visible' : 'hidden',
                }}
              >
                <div className="p-3 md:p-5 rounded-xl h-full flex flex-col relative overflow-hidden bg-card shadow-md">
                  <Quote 
                    className="w-10 h-10 opacity-10 absolute top-5 left-5" 
                  />
                  <p className="mb-4 text-base md:text-lg italic relative z-10 text-card-foreground">
                    "{testimonial.text}"
                  </p>
                  <div className="mt-auto flex items-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {}
          <div className="flex justify-center items-center mt-4 gap-2">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-full bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === index ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="p-2 rounded-full bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 