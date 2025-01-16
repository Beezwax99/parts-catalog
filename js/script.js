document.addEventListener('DOMContentLoaded', function() {
    // Header burger
    const headerBurger = document.querySelector('.header__burger');
    const headerMenu = document.querySelector('.header__menu');
    headerBurger.addEventListener('click', () => {
        headerBurger.classList.toggle('active');
        headerMenu.classList.toggle('active');
    });
       
    // Services
    const serviceItems = document.querySelectorAll('.services__item');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            serviceItems.forEach(i => i.classList.remove('services__item--active'));
            item.classList.add('services__item--active');
        });
    });

    
    // Places
    const placesCards = document.querySelectorAll('.places-card');
    const search = document.querySelector('.search');
    const backButton = document.querySelector('.place__back');

    placesCards.forEach(card => {
        card.addEventListener('click', function() {
            const placeId = card.getAttribute('data-id');
            
            const activeElement = document.querySelector(`#${placeId}`);
            if (activeElement) {
                activeElement.classList.add('active');
            }

            if (search) {
                search.classList.add('places-hidden');
            }

            const targetPlace = document.querySelector(`[data-id="${placeId}"]`);
            if (targetPlace) {
                targetPlace.classList.add('place-visible');
            }
        });
    });
    if (backButton) {
        backButton.addEventListener('click', function() {
            const activeElement = document.querySelector('.place.active');
            if (activeElement) {
                activeElement.classList.remove('active');
            }
            if (search) {
                search.classList.remove('places-hidden');
            }
            placesCards.forEach(card => {
                const placeId = card.getAttribute('data-id');
                const targetPlace = document.querySelector(`[data-id="${placeId}"]`);
                if (targetPlace) {
                    targetPlace.classList.remove('place-visible');
                }
            });
        });
    }

    // Tabs in places
    const places = document.querySelectorAll('.place');
    places.forEach(place => {
        const tabs = place.querySelectorAll('.place__tab');
        
        tabs.forEach(tab => {
            if (tab.classList.contains('active')) {
                const tabId = tab.getAttribute('data-tab').replace('#', '');
                const activeTabContent = place.querySelector(`#${tabId}`);
                
                if (activeTabContent) {
                    activeTabContent.classList.add('active');
                }
            }

            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabId = tab.getAttribute('data-tab').replace('#', '');
                const activeTabContent = place.querySelector(`#${tabId}`);
                
                place.querySelectorAll('.place__content').forEach(content => content.classList.remove('active'));
                
                if (activeTabContent) {
                    activeTabContent.classList.add('active');
                }
            });
        });
    });


    // Show more images
    const toggleBtn = document.querySelector('.place__gallery--btn');
    const extraImages = document.querySelectorAll('.place__gallery--item.extra');

    if (!toggleBtn || extraImages.length === 0) return;

    function updateButton() {
        const hiddenCount = extraImages.length;
        toggleBtn.textContent = `+${hiddenCount}`;
    }

    toggleBtn.addEventListener('click', function() {
        extraImages.forEach(function(img) {
            img.style.display = 'block';
        });
        toggleBtn.style.display = 'none';
    });
    updateButton();
    
    
    // See more text
    const moreButtons = document.querySelectorAll('.place__text--more');
    moreButtons.forEach(moreButton => {
        moreButton.addEventListener('click', function() {
            const placeContent = moreButton.closest('.place__content');
            const textBlock = placeContent.querySelector('.place__text');
            
            if (textBlock) {
                textBlock.classList.toggle('expanded');
                if (textBlock.classList.contains('expanded')) {
                    moreButton.textContent = 'See less';
                } else {
                    moreButton.textContent = 'See more...';
                }
            }
        });
    });

    // Review stars
    const ratingChoices = document.querySelectorAll('.rating__choise');
    
    ratingChoices.forEach(choice => {
        choice.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            
            ratingChoices.forEach((el, index) => {
                if (index < value) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
        });
    });


    const openPopupLink = document.querySelector('a[href="#add-review"]');
    const closePopupBtn = document.querySelector('.popup__close');
    const popup = document.getElementById('add-review');
    
    if (openPopupLink && popup) {
        openPopupLink.addEventListener('click', function(event) {
            event.preventDefault();
            popup.classList.add('active');
        });
    }

    if (closePopupBtn && popup) {
        closePopupBtn.addEventListener('click', function() {
            popup.classList.remove('active');
        });
    }
    
    
});

// Remove item of search__tag
document.querySelectorAll('.search__tag span').forEach(function(span) {
    span.addEventListener('click', function() {
        span.remove();
    });
});


//draggable places
document.addEventListener("DOMContentLoaded", () => {
    let dragHandle = document.querySelector(".place__drag-handle");
    let placeSection = document.querySelector(".place");
    let header = document.querySelector(".header");
    let placeTexts = document.querySelectorAll(".place__text");
    let toggleButtons = document.querySelectorAll(".place__text--more");

    // Check if the necessary elements exist
    if (dragHandle && placeSection && header && placeTexts.length > 0 && toggleButtons.length > 0) {

        let startY = 0, startHeight = 300, isDragging = false;

        let startDrag = (e) => {
            isDragging = true;
            startY = e.touches ? e.touches[0].clientY : e.clientY;
            startHeight = placeSection.getBoundingClientRect().height;
            placeSection.style.transition = "none";
        };

        let onDrag = (e) => {
            if (!isDragging) return;

            let currentY = e.touches ? e.touches[0].clientY : e.clientY;
            let deltaY = startY - currentY;
            let headerHeight = header.getBoundingClientRect().height;
            let newHeight = Math.min(
                window.innerHeight - headerHeight,
                Math.max(250, startHeight + deltaY)
            );

            placeSection.style.height = `${newHeight}px`;

            placeTexts.forEach(text => {
                if (newHeight > window.innerHeight * 0.7) {
                    text.classList.add("expanded");
                } else {
                    text.classList.remove("expanded");
                }
            });

            toggleButtons.forEach(button => {
                placeTexts.forEach(text => {
                    if (text.classList.contains("expanded")) {
                        button.textContent = "See less";
                    } else {
                        button.textContent = "See more...";
                    }
                });
            });
        };

        let stopDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            placeSection.style.transition = "height 0.3s ease";

            let currentHeight = placeSection.getBoundingClientRect().height;
            let headerHeight = header.getBoundingClientRect().height;

            placeSection.style.height = currentHeight > window.innerHeight * 0.7
                ? `${window.innerHeight - headerHeight}px`
                : currentHeight < 400
                ? "250px"
                : `${currentHeight}px`;

            placeTexts.forEach(text => {
                if (currentHeight > window.innerHeight * 0.7) {
                    text.classList.add("expanded"); 
                } else {
                    text.classList.remove("expanded"); 
                }
            });

            toggleButtons.forEach(button => {
                placeTexts.forEach(text => {
                    if (text.classList.contains("expanded")) {
                        button.textContent = "See less";
                    } else {
                        button.textContent = "See more...";
                    }
                });
            });
        };

        dragHandle.addEventListener("mousedown", startDrag);
        dragHandle.addEventListener("touchstart", startDrag);
        document.addEventListener("mousemove", onDrag);
        document.addEventListener("touchmove", onDrag);
        document.addEventListener("mouseup", stopDrag);
        document.addEventListener("touchend", stopDrag);
    }
});


// Modal for gallery
document.addEventListener("DOMContentLoaded", () => {
    let galleryItems = document.querySelectorAll(".place__gallery--item img");

    let modal = document.createElement("div");
    modal.classList.add("modal");

    let modalImage = document.createElement("img");
    modal.appendChild(modalImage);

    let closeButton = document.createElement("button");
    closeButton.classList.add("modal-close");
    closeButton.textContent = "×";
    modal.appendChild(closeButton);

    document.body.appendChild(modal);

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            let imgSrc = item.src;  
            modalImage.src = imgSrc;
            modal.style.display = "flex";
        });
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
