document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const imgBoxes = document.querySelectorAll('.imgBox');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Change image on hover
    imgBoxes.forEach(box => {
        const img = box.querySelector('img');
        const originalSrc = img.src;
        const hoverSrc = box.getAttribute('data-hover');

        box.addEventListener('mouseover', () => {
            img.style.transition = 'opacity 0.5s ease';
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = hoverSrc;
                img.style.opacity = '1';
            }, 500);
        });

        box.addEventListener('mouseout', () => {
            img.style.transition = 'opacity 0.5s ease';
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = originalSrc;
                img.style.opacity = '1';
            }, 500);
        });
    });
});
