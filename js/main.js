const { createApp, ref, computed, onMounted, watch } = Vue;

// Define the base URL for the backend API
const backendUrl = 'https://express-lessons-api-6hj1.onrender.com'; 

createApp({
    setup() {
        const lessons = ref([]);
        const cart = ref([]);
        const showLessons = ref(true);
        const addedToCartMessage = ref('');
        const messageTimeout = ref(null);
        const messageProgress = ref(100);
        // Sorting preferences
        const sortAttribute = ref('topic');
        const sortOrder = ref('ascending');
       
        // The text typed into the search bar
        const searchQuery = ref('');
        
        // Checkout form data
        const firstName = ref('');
        const lastName = ref('');
        const phoneNumber = ref('');
        const checkoutMessage = ref('');
       
        // Stores any errors returned by the backend
        const serverErrors = ref([]); 

        // --- FETCH DATA --
        // Gets all lessons from the backend when the app loads or search is cleared
        const fetchLessons = async () => {
            try {
                const response = await fetch(backendUrl + '/lessons');
                if (!response.ok) {
                    throw new Error('Could not fetch lessons from server.');
                }
                let data = await response.json();
                
                // Loops through lessons to fix the image URL path
                data.forEach(lesson => {
                    lesson.image = `${backendUrl}/images/${lesson.image}`;
                });

                lessons.value = data;
            } catch (error) {
                console.error('Fetch error:', error);
                serverErrors.value = [error.message];
            }
        };

        // --- SEARCH ---
        // Watches the search bar. If the text changes, it queries the backend search endpoint.
        watch(searchQuery, async (newQuery) => {
            // If search is empty, just fetch all lessons again
            if (newQuery.trim() === '') {
                fetchLessons(); 
                return;
            }
            
            try {
                // Send the search query to the server
                const response = await fetch(`${backendUrl}/lessons/search?q=${newQuery}`);
                if (!response.ok) throw new Error('Search failed');
                
                let data = await response.json();

                // Fix image paths for search results
                data.forEach(lesson => {
                    lesson.image = `${backendUrl}/images/${lesson.image}`;
                });

                lessons.value = data; 
            } catch (error) {
                console.error('Search error:', error);
            }
        });

        // This runs once when the page first loads to get the initial data
        onMounted(() => {
            fetchLessons();
        });

        // --- SORTING & FILTERING ---
        
        // A placeholder computed property (currently just returns all lessons)
        const filteredLessons = computed(() => {
            return lessons.value; 
        });

        // Sorts the lessons based on the selected attribute (e.g., Price, Topic) and order
        const sortedLessons = computed(() => {
            return [...filteredLessons.value].sort((a, b) => {
                let valA = a[sortAttribute.value];
                let valB = b[sortAttribute.value];
                let comparison = 0;
                
                // Sort logic for text vs numbers
                if (typeof valA === 'string') {
                    comparison = valA.localeCompare(valB);
                } else {
                    comparison = valA - valB;
                }
                // Reverse the result if descending is selected
                return sortOrder.value === 'descending' ? -comparison : comparison;
            });
        });

        // --- FORM VALIDATION  ---
        // Check if names contain numbers (RegEx: \d)
        const isFirstNameInvalid = computed(() => firstName.value.length > 0 && /\d/.test(firstName.value));
        const isLastNameInvalid = computed(() => lastName.value.length > 0 && /\d/.test(lastName.value));
        // Check if phone number contains letters (RegEx: \D means non-digits)
        const isPhoneNumberInvalid = computed(() => phoneNumber.value.length > 0 && /\D/.test(phoneNumber.value));
        
        // Check if the entire form is ready to submit (all fields filled and valid)
        const isFormValid = computed(() => {
            return firstName.value.trim() !== '' &&
                   lastName.value.trim() !== '' &&
                   phoneNumber.value.trim() !== '' &&
                   !isFirstNameInvalid.value &&
                   !isLastNameInvalid.value &&
                   !isPhoneNumberInvalid.value;
        });

        // --- UI NOTIFICATION  ---
        // Creates a visual progress bar that shrinks over 3 seconds when an item is added
        const startMessageProgress = () => {
            const duration = 3000;
            const interval = 50;
            const decrement = (interval / duration) * 100;
            messageProgress.value = 100;
            if (messageTimeout.value) clearInterval(messageTimeout.value);
            
            // Timer loop to reduce the progress bar width
            messageTimeout.value = setInterval(() => {
                messageProgress.value -= decrement;
                if (messageProgress.value <= 0) {
                    clearInterval(messageTimeout.value);
                    addedToCartMessage.value = '';
                }
            }, interval);
        };

        // --- CART FEATURE ---
        // Adds a lesson to the cart and decreases the available space
        const addToCart = (lesson) => {
            if (lesson.space > 0) {
                // Check if item is already in cart
                const cartItem = cart.value.find(item => item._id === lesson._id);
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    cart.value.push({ ...lesson, quantity: 1 });
                }
                lesson.space--; // Decrease inventory 
                addedToCartMessage.value = `${lesson.topic} was added to your cart!`;
                startMessageProgress();
            }
        };
        
        // Removes an item from the cart and gives the space back to the lesson
        const removeFromCart = (cartItem) => {
            const index = cart.value.indexOf(cartItem);
            if (index > -1) {
                const lesson = lessons.value.find(l => l._id === cartItem._id);
                if (lesson) {
                    lesson.space += cartItem.quantity; // Restore inventory
                }
                cart.value.splice(index, 1); // Remove from array
            }
        };

        // --- CHECKOUT ---
        // Handles submitting the order to the backend
        const checkout = async () => {
            if (!isFormValid.value) return; // Stop if form is invalid

            console.log('Starting checkout...');
            serverErrors.value = []; 

            // Prepare the order object
            const orderDetails = {
                firstName: firstName.value,
                lastName: lastName.value,
                phoneNumber: phoneNumber.value,
                items: cart.value.map(item => ({
                    lessonId: item._id,
                    quantity: item.quantity,
                    topic: item.topic 
                }))
            };

            try {
                // POST request to create the order in the database
                const postResponse = await fetch(backendUrl + '/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderDetails)
                });

                if (!postResponse.ok) {
                    const errorBody = await postResponse.json();
                    throw new Error(`Failed to submit order: ${errorBody.error}`);
                }
                
                await postResponse.json();
                console.log('Order submitted successfully');

                // PUT requests to update the remaining spaces (inventory) for each lesson in the DB
                const updatePromises = cart.value.map(cartItem => {
                    const lesson = lessons.value.find(l => l._id === cartItem._id);
                    const newSpace = lesson ? lesson.space : cartItem.space;
                    
                    return fetch(backendUrl + '/lessons/' + cartItem._id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ space: newSpace })
                    });
                });
                
                // Wait for all inventory updates to finish
                await Promise.all(updatePromises);
                console.log('All lesson spaces updated');

                // Reset the form and cart on success
                cart.value = [];
                firstName.value = '';
                lastName.value = '';
                phoneNumber.value = '';
                checkoutMessage.value = 'Order submitted successfully!';
                setTimeout(() => checkoutMessage.value = '', 5000);

            } catch (error) {
                // Handle errors 
                console.error('Checkout failed:', error);
                serverErrors.value = [error.message];
                checkoutMessage.value = 'Checkout failed. Please try again.';
                
                // If it fails, restore the spaces 
                cart.value.forEach(cartItem => {
                    const lesson = lessons.value.find(l => l._id === cartItem._id);
                    if (lesson) {
                        lesson.space += cartItem.quantity;
                    }
                });
                
                setTimeout(() => checkoutMessage.value = '', 5000);
            }
        };
        
        return {
            lessons, cart, showLessons, addedToCartMessage, messageProgress,
            sortAttribute, sortOrder, searchQuery,
            firstName, lastName, phoneNumber, checkoutMessage,
            filteredLessons, sortedLessons,
            isFirstNameInvalid, isLastNameInvalid, isPhoneNumberInvalid, isFormValid,
            serverErrors, 
            addToCart, removeFromCart, checkout,
            backendUrl 
        };
    }
}).mount('#app');