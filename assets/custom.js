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
                form.querySelectorAll('input[required]').forEach(function (input) {
                    if (!input.value) {
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
});
