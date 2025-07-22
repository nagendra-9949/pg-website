// Mobile Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Note: FormData with files requires a different fetch setup
        // This example will send the text fields as JSON.
        // Handling file uploads requires more complex backend logic (e.g., using multer).
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            aadhar: formData.get('aadharId'),
            roomType: formData.get('roomType'),
            message: formData.get('message'),
            date: new Date().toISOString().split('T')[0]
        };

        fetch('http://localhost:8080/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            alert('Thank you! We will contact you soon.');
            this.reset();
            document.querySelector('.file-name').textContent = 'No file chosen';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your booking. Please try again.');
        });
    });
}

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/Hide Scroll to Top Button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Add styles for scroll to top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1a365d;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: none;
        font-size: 20px;
        z-index: 1000;
    }
    
    .scroll-to-top:hover {
        background: #2d3748;
    }
`;
document.head.appendChild(style); 