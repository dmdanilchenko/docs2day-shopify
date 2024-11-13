/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */
window.addEventListener('load', function () {
    formValidation(document.getElementById('create_customer'));
    formValidation(document.getElementById('contact_form'));

    function formValidation(form) {
        if (form) {
            form.addEventListener('submit', function (event) {
                let errors = false;
                // get all required inputs
                form.querySelectorAll('input[required], textarea[required]').forEach(function (input) {
                    if (!input.value || (input.type === 'checkbox' && !input.checked)) {
                        // add aria-invalid="true"
                        input.setAttribute('aria-invalid', 'true');
                        errors = true;
                    } else {
                        input.setAttribute('aria-invalid', 'false');
                    }
                    if (input.parentNode.querySelector('.error')) {
                        input.parentNode.querySelector('.error').remove();
                    }
                    if (!input.value) {
                        var error = document.createElement('span');
                        error.className = 'error';
                        error.textContent = window.theme.requiredFieldErrorMessage;
                        //insert to parent
                        input.parentNode.append(error);
                    }
                });

                if (errors) {
                    event.preventDefault();
                }
            });
        }
    }

    var logout = document.querySelector('a[href^="/account/logout"]');
    if (logout) {
        logout.addEventListener('click', function (event) {
            event.preventDefault();
            let href = logout.getAttribute('href'),
                target = '';
            fetch(window.Shopify.routes.root + 'cart/clear.js')
                .then(response => {
                    window.open(href, (!target ? "_self" : target));
                })
                .then(data => {
                    return data
                });
        });
    }

    let triggerMyAccountDropdown = document.querySelector('button[data-action="toggle-my-account-linklist"]'),
        dropdown = document.getElementById('my-account-linklist');
    if (triggerMyAccountDropdown && dropdown) {
        triggerMyAccountDropdown.addEventListener('click', function (event) {
            triggerMyAccountDropdown.setAttribute('aria-expanded', triggerMyAccountDropdown.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            dropdown.setAttribute('aria-hidden', dropdown.getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
        });
    }


    // add or remove class is-scrolled to body
    const body = document.body;
    window.addEventListener('scroll', function () {
        checkScroll()
    });
    checkScroll();

    function checkScroll() {
        if (window.scrollY > 100) {
            body.classList.add('is-scrolled');
        } else {
            body.classList.remove('is-scrolled');
        }
    }


    // add event listener to filter-button
    const filterButtons = document.querySelectorAll('.filter-button');
    const packages = document.querySelectorAll('.package-box');
    const packagesContainer = document.querySelector('.package-container');

    if (filterButtons) {
        filterButtons.forEach(function (filterButton) {
            filterButton.addEventListener('click', function () {
                filterPackages(filterButton);
                filterButtons.forEach(function (button) {
                    button.classList.remove('filter-button--active');
                });
                filterButton.classList.add('filter-button--active');
            });

            if (filterButton.classList.contains('filter-button--active')) {
                filterPackages(filterButton);
            }
        });
    }

    function filterPackages(filterButton) {
        const filter = filterButton.getAttribute('data-filter');
        let showcount = 0;
        packages.forEach(function (package) {
            if (package.classList.contains(filter)) {
                package.classList.add('show');
                showcount++;
            } else {
                package.classList.remove('show');
            }
        });

        if (showcount <= 2) {
            packagesContainer.classList.add('two-columns');
        } else {
            packagesContainer.classList.remove('two-columns');
        }
    }

    const teamMembers = document.querySelectorAll('.custom-team-member');
    if (teamMembers) {
        teamMembers.forEach(function (teamMember) {
            teamMember.addEventListener('click', function () {
                let isActive = teamMember.classList.contains('active');

                teamMembers.forEach(function (member) {
                    member.classList.remove('active');
                });

                if (isActive) {
                    teamMember.classList.remove('active');
                } else {
                    teamMember.classList.add('active');
                }
            });
        });
    }

    // add event listener to filter-button
    const filterFAQsButtons = document.querySelectorAll('.faq__heading');
    const faqGroups = document.querySelectorAll('.faq__group');

    if (filterFAQsButtons) {
        filterFAQsButtons.forEach(function (filterButton) {
            filterButton.addEventListener('click', function () {
                filterFAQs(filterButton);
                filterFAQsButtons.forEach(function (button) {
                    button.classList.remove('faq__heading--active');
                });
                filterButton.classList.add('faq__heading--active');
            });

            if (filterButton.classList.contains('faq__heading--active')) {
                filterFAQs(filterButton);
            }
        });
    }

    function filterFAQs(filterButton) {
        const filter = filterButton.getAttribute('data-filter');
        faqGroups.forEach(function (faq) {
            if (faq.classList.contains(filter)) {
                faq.classList.add('show');
            } else {
                faq.classList.remove('show');
            }
        });
    }

    //testimonials--show-all on click listener
    const showAllButton = document.querySelector('.testimonials--show-all');
    const testimonials = document.querySelectorAll('.testimonials--page');
    if (showAllButton) {
        showAllButton.addEventListener('click', function (event) {
            event.preventDefault();
            testimonials.forEach(function (testimonial) {
                if (testimonial.classList.contains('hidden')) {
                    testimonial.classList.remove('hidden');
                } else{
                    testimonial.classList.add('hidden');
                }
            });
            showAllButton.classList.add('hide');
        });
    }
});
