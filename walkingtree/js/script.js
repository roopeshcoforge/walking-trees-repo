document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Carousel functionality
    function setupCarousel(carouselWrapperSelector, carouselSelector, prevBtnSelector, nextBtnSelector) {
        const carouselWrapper = document.querySelector(carouselWrapperSelector);
        const carousel = document.querySelector(carouselSelector);
        const prevBtn = carouselWrapper.querySelector(prevBtnSelector);
        const nextBtn = carouselWrapper.querySelector(nextBtnSelector);

        if (!carousel || !prevBtn || !nextBtn) {
            console.warn(`Carousel elements not found for selector: ${carouselSelector}`);
            return; // Exit if elements not found
        }

        const carouselItems = carousel.querySelectorAll('.carousel-item');
        let currentIndex = 0;
        let itemWidthWithGap = 0; // Will be calculated dynamically

        const gap = 20; // Matches the CSS gap

        function calculateItemsAndWidth() {
            if (carouselItems.length === 0) return;

            // Get the computed style of the first item to account for its margin/padding/border
            const itemStyle = getComputedStyle(carouselItems[0]);
            const itemMarginRight = parseFloat(itemStyle.marginRight);

            // Get the actual width of the first item
            const itemBaseWidth = carouselItems[0].offsetWidth;
            itemWidthWithGap = itemBaseWidth + gap; // Base item width + CSS gap

            // Set the scroll position for the carousel to reflect current index
            carousel.scrollLeft = currentIndex * itemWidthWithGap;

            updateNavButtons();
        }

        function updateNavButtons() {
            // Disable prev button if at the beginning
            prevBtn.disabled = currentIndex === 0;

            // Disable next button if at or near the end
            // We need to check if there's enough content left to scroll one more "view"
            const currentScrollableWidth = carousel.scrollWidth - carousel.clientWidth;
            nextBtn.disabled = (carousel.scrollLeft + 1 >= currentScrollableWidth) || (carouselItems.length <= getItemsPerView());
            // Add +1 for a small tolerance, sometimes scrollLeft can be slightly less than max
            // Also disable if there are fewer items than can be displayed in one view
        }

        function getItemsPerView() {
            // Calculate how many items can fit in the current carousel wrapper width
            if (itemWidthWithGap === 0) return 1; // Prevent division by zero
            return Math.floor(carouselWrapper.clientWidth / itemWidthWithGap);
        }

        nextBtn.addEventListener('click', () => {
            const itemsToScroll = getItemsPerView();
            const totalItems = carouselItems.length;

            if (currentIndex + itemsToScroll < totalItems) {
                currentIndex += itemsToScroll;
            } else {
                // If not enough items for a full scroll, jump to the end of items
                currentIndex = Math.max(0, totalItems - itemsToScroll);
            }
            carousel.scrollLeft = currentIndex * itemWidthWithGap;
            updateNavButtons();
        });

        prevBtn.addEventListener('click', () => {
            const itemsToScroll = getItemsPerView();
            if (currentIndex - itemsToScroll >= 0) {
                currentIndex -= itemsToScroll;
            } else {
                currentIndex = 0; // Go back to the very beginning
            }
            carousel.scrollLeft = currentIndex * itemWidthWithGap;
            updateNavButtons();
        });

        // Add scroll event listener to update button state when user manually scrolls (if overflow:scroll were enabled)
        // Or, more importantly, when the carousel content changes dynamically (though not happening here)
        carousel.addEventListener('scroll', updateNavButtons);

        // Update carousel on window resize and initial load
        window.addEventListener('resize', () => {
            // Reset index to 0 on resize to avoid issues with changing item counts per view
            currentIndex = 0;
            calculateItemsAndWidth(); // Recalculate widths and update buttons
        });

        // Initial setup
        calculateItemsAndWidth();
        updateNavButtons(); // Ensure initial button states are correct
    }

    // Initialize carousels
    // Note: The 'itemsPerViewDesktop', 'itemsPerViewTablet', 'itemsPerViewMobile' arguments
    // are no longer directly used by `setupCarousel` as it calculates dynamically.
    // However, the CSS `flex-basis` and `min-width` rules will dictate how many items appear.
    setupCarousel('.watersports-section .carousel-wrapper', '.watersports-carousel', '.prev', '.next');
    setupCarousel('.venue-section .carousel-wrapper', '.venue-carousel', '.prev', '.next');
});