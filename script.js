// Execute after page loading is complete
document.addEventListener('DOMContentLoaded', function () {
  // Add click events for survey buttons
  const surveyButtons = document.querySelectorAll('.survey-btn, .cta-button');

  surveyButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Simulate survey popup or redirect
      alert(
        'Thank you for your interest! Survey functionality coming soon.\n\nWe will contact you via email at hello@mutopia.ca'
      );
    });
  });

  // Add smooth scrolling effect
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
        });
      }
    });
  });

  // Add scroll animation effects
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements that need animation
  const animateElements = document.querySelectorAll(
    '.testimonial, .hero-text, .challenge-intro'
  );
  animateElements.forEach(el => {
    observer.observe(el);
  });

  // Add page loading animation
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // Add click effect for logo
  const logo = document.querySelector('.logo');
  logo.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Add mouse following effect for dog container
  // const dogContainer = document.querySelector('.dog-container');
  // if (dogContainer) {
  //     dogContainer.addEventListener('mousemove', function(e) {
  //         const rect = this.getBoundingClientRect();
  //         const x = e.clientX - rect.left;
  //         const y = e.clientY - rect.top;

  //         const centerX = rect.width / 2;
  //         const centerY = rect.height / 2;

  //         const deltaX = (x - centerX) / centerX;
  //         const deltaY = (y - centerY) / centerY;

  //         const dogImage = this.querySelector('.dog-image');
  //         dogImage.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px) scale(1.02)`;
  //     });

  //     dogContainer.addEventListener('mouseleave', function() {
  //         const dogImage = this.querySelector('.dog-image');
  //         dogImage.style.transform = 'translate(0px, 0px) scale(1)';
  //     });
  // }

  // Add page visibility detection
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      // Handle when page becomes visible again
      document.title = 'Mutopia - Pet Grooming Service Platform';
    } else {
      // Handle when page becomes invisible
      document.title = '🐾 Don\'t go! Mutopia is waiting for you';
    }
  });
});
