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
    const backButtons = document.querySelectorAll('.place__back');

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

    backButtons.forEach(backButton => {
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
    });

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


    // Gallery
    const galleryContents = document.querySelectorAll('.place__gallery--content');

    galleryContents.forEach((content) => {
        const toggleBtn = content.querySelector('.place__gallery--btn');
        const extraImages = content.querySelectorAll('.place__gallery--item.extra');

        if (!toggleBtn || extraImages.length === 0) return;

        function updateButton() {
            const hiddenCount = extraImages.length;
            toggleBtn.textContent = `+${hiddenCount}`;
        }

        toggleBtn.addEventListener('click', function () {
            extraImages.forEach((img) => {
                img.style.display = 'block';
            });
            toggleBtn.style.display = 'none';
        });

        updateButton();
    });

    
    
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

    // Add review
    const openPopupLinks = document.querySelectorAll('a[href="#add-review"]');
    const closePopupBtn = document.querySelector('.popup__close');
    const popup = document.getElementById('add-review');

    if (popup) {
        openPopupLinks.forEach((link) => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                popup.classList.add('active');
            });
        });

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', function() {
                popup.classList.remove('active');
            });
        }
    }

    
    
    const mapMarkers = document.querySelectorAll('.map__marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const placeId = marker.getAttribute('data-id');
            
            // Сначала скрываем все активные элементы
            const currentActive = document.querySelector('.place.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }

            // Показываем новый элемент
            const activeElement = document.querySelector(`#${placeId}`);
            if (activeElement) {
                activeElement.classList.add('active');
            }

            if (search) {
                search.classList.add('places-hidden');
            }

            // Скрываем все видимые места
            document.querySelectorAll('.place-visible').forEach(place => {
                place.classList.remove('place-visible');
            });

            // Показываем выбранное место
            const targetPlace = document.querySelector(`[data-id="${placeId}"]`);
            if (targetPlace) {
                targetPlace.classList.add('place-visible');
            }
        });
    });
});

// Remove item of search__tag
document.querySelectorAll('.search__tag span').forEach(function(span) {
    span.addEventListener('click', function() {
        span.remove();
    });
});


//draggable places
document.addEventListener("DOMContentLoaded", () => {
    let dragHandles = document.querySelectorAll(".place__drag-handle");
    let places = document.querySelectorAll(".place");
    let header = document.querySelector(".header");
    let placeTexts = document.querySelectorAll(".place__text");
    let toggleButtons = document.querySelectorAll(".place__text--more");

    if (dragHandles.length && places.length && header && placeTexts.length > 0 && toggleButtons.length > 0) {
        dragHandles.forEach((dragHandle, index) => {
            let startY = 0, startHeight = 300, isDragging = false;
            const MIN_HEIGHT = 50;
            let currentPlace = places[index];

            let isWithinBounds = (e) => {
                let rect = dragHandle.getBoundingClientRect();
                let y = e.touches ? e.touches[0].clientY : e.clientY;
                return y >= rect.top && y <= rect.bottom;
            };

            let startDrag = (e) => {
                if (!isWithinBounds(e)) return;

                isDragging = true;
                startY = e.touches ? e.touches[0].clientY : e.clientY;
                startHeight = currentPlace.getBoundingClientRect().height;

                currentPlace.style.transition = "none";
                currentPlace.style.overflowY = "hidden";
            };

            let onDrag = (e) => {
                if (!isDragging) return;

                let currentY = e.touches ? e.touches[0].clientY : e.clientY;
                let deltaY = startY - currentY;
                let headerHeight = header.getBoundingClientRect().height;
                let newHeight = Math.min(
                    window.innerHeight - headerHeight,
                    Math.max(MIN_HEIGHT, startHeight + deltaY)
                );

                currentPlace.style.height = `${newHeight}px`;

                if (newHeight === MIN_HEIGHT) {
                    currentPlace.classList.remove("active");
                    currentPlace.style.height = `350px`;
                } else {
                    currentPlace.classList.add("active");
                }

                const currentPlaceTexts = currentPlace.querySelectorAll('.place__text');
                const currentToggleButtons = currentPlace.querySelectorAll('.place__text--more');

                currentPlaceTexts.forEach(text => {
                    if (newHeight > window.innerHeight * 0.7) {
                        text.classList.add("expanded");
                    } else {
                        text.classList.remove("expanded");
                    }
                });

                currentToggleButtons.forEach(button => {
                    currentPlaceTexts.forEach(text => {
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

                let currentHeight = currentPlace.getBoundingClientRect().height;
                currentPlace.style.transition = "height 0.3s ease";
                currentPlace.style.overflowY = "auto";
                let headerHeight = header.getBoundingClientRect().height;

                if (currentHeight > window.innerHeight * 0.7) {
                    currentPlace.style.height = `${window.innerHeight - headerHeight}px`;
                }

                const currentPlaceTexts = currentPlace.querySelectorAll('.place__text');
                const currentToggleButtons = currentPlace.querySelectorAll('.place__text--more');

                currentPlaceTexts.forEach(text => {
                    if (currentHeight > window.innerHeight * 0.7) {
                        text.classList.add("expanded");
                    } else {
                        text.classList.remove("expanded");
                    }
                });

                currentToggleButtons.forEach(button => {
                    currentPlaceTexts.forEach(text => {
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
        });
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
