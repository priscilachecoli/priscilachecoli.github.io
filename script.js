// ===================================
// MOBILE MENU TOGGLE
// ===================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav')) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===================================
// SMOOTH SCROLLING
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// HEADER SCROLL EFFECT
// ===================================

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }

    lastScroll = currentScroll;
});

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================

const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll(
    '.approach-card, .service-card, .testimonial-card, .about-content, .about-image'
);

animatedElements.forEach(el => observer.observe(el));

// ===================================
// FORM SUBMISSION WITH FORMSPREE
// ===================================

const contactForm = document.querySelector('.contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get submit button
        const submitButton = contactForm.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        submitButton.style.opacity = '0.7';

        // Get form data
        const formData = new FormData(contactForm);

        try {
            // Send to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                showNotification(
                    'Mensagem enviada com sucesso! Entrarei em contato em breve.',
                    'success'
                );

                // Show success message in form
                if (formStatus) {
                    formStatus.innerHTML = '<p style="color: #6D54A9; font-weight: 500;">✓ Mensagem enviada com sucesso!</p>';
                }

                // Reset form
                contactForm.reset();

                // Clear status message after 5 seconds
                setTimeout(() => {
                    if (formStatus) formStatus.innerHTML = '';
                }, 5000);

            } else {
                // Error from Formspree
                const data = await response.json();
                throw new Error(data.error || 'Erro ao enviar mensagem');
            }

        } catch (error) {
            // Error
            console.error('Form submission error:', error);
            showNotification(
                'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato por email.',
                'error'
            );

            if (formStatus) {
                formStatus.innerHTML = '<p style="color: #d32f2f; font-weight: 500;">✗ Erro ao enviar. Tente novamente.</p>';
            }
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.style.opacity = '1';
        }
    });
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#8B7355' : '#d32f2f'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-size: 0.95rem;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===================================
// WHATSAPP BUTTON (Optional Enhancement)
// ===================================

function createWhatsAppButton() {
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/5561999999999?text=Olá,%20gostaria%20de%20agendar%20uma%20consulta%2E';
    whatsappButton.target = '_blank';
    whatsappButton.rel = 'noopener noreferrer';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.setAttribute('aria-label', 'Contato via WhatsApp');

    whatsappButton.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.164 0 0 7.164 0 16C0 18.839 0.743 21.504 2.032 23.824L0.697 30.877L7.987 29.584C10.218 30.713 12.726 31.36 15.388 31.36H16C24.836 31.36 32 24.196 32 15.36C32 6.524 24.836 0 16 0Z" fill="#25D366"/>
            <path d="M25.37 22.725C25.01 23.925 23.37 24.925 22.09 25.225C21.22 25.425 20.09 25.595 16.43 24.075C11.74 22.155 8.73 17.295 8.5 16.995C8.28 16.695 6.66 14.525 6.66 12.275C6.66 10.025 7.82 8.925 8.24 8.495C8.6 8.125 9.18 7.975 9.73 7.975C9.91 7.975 10.07 7.985 10.22 7.995C10.64 8.015 10.85 8.045 11.12 8.695C11.48 9.545 12.31 11.795 12.41 11.995C12.51 12.195 12.61 12.465 12.47 12.765C12.34 13.075 12.23 13.185 12 13.445C11.77 13.705 11.55 13.905 11.32 14.185C11.11 14.425 10.87 14.685 11.14 15.145C11.41 15.595 12.3 17.045 13.61 18.195C15.31 19.685 16.71 20.195 17.2 20.405C17.56 20.555 17.99 20.525 18.27 20.225C18.62 19.855 19.03 19.255 19.45 18.665C19.75 18.245 20.12 18.195 20.53 18.345C20.95 18.485 23.19 19.585 23.61 19.795C24.03 19.995 24.31 20.095 24.41 20.275C24.51 20.455 24.51 21.305 24.15 22.315L25.37 22.725Z" fill="white"/>
        </svg>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #25D366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
            .whatsapp-float {
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
            }
            .whatsapp-float svg {
                width: 28px;
                height: 28px;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(whatsappButton);
}

// WhatsApp floating button enabled
createWhatsAppButton();

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Lazy load images - only for images using data-src pattern
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    // Only load lazysizes if there are images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

// ===================================
// FAQ ACCORDION
// ===================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        const answer = question.nextElementSibling;

        // Close all other FAQ items
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.classList.remove('active');
            }
        });

        // Toggle current item
        question.setAttribute('aria-expanded', !isExpanded);
        answer.classList.toggle('active');
    });
});

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded successfully');

    // Add any initialization code here
    activateNavLink();
});
