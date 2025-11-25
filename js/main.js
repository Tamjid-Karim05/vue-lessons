const { createApp, ref, computed, onMounted, watch } = Vue;

const backendUrl = 'https://express-lessons-api-6hj1.onrender.com'; 

createApp({
    setup() {
        const lessons = ref([]);
        const cart = ref([]);
        const showLessons = ref(true);
        const addedToCartMessage = ref('');
        const messageTimeout = ref(null);
        const messageProgress = ref(100);
        const sortAttribute = ref('topic');
        const sortOrder = ref('ascending');
        const searchQuery = ref('');
        const firstName = ref('');
        const lastName = ref('');
        const phoneNumber = ref('');
        const checkoutMessage = ref('');
        const serverErrors = ref([]); 

        const fetchLessons = async () => {
            try {
                const response = await fetch(backendUrl + '/lessons');
                if (!response.ok) {
                    throw new Error('Could not fetch lessons from server.');
                }
                let data = await response.json();
                
                data.forEach(lesson => {
                    lesson.image = `${backendUrl}/images/${lesson.image}`;
                });

                lessons.value = data;
            } catch (error) {
                console.error('Fetch error:', error);
                serverErrors.value = [error.message];
            }
        };

        watch(searchQuery, async (newQuery) => {
            if (newQuery.trim() === '') {
                fetchLessons(); 
                return;
            }
            
            try {
                const response = await fetch(`${backendUrl}/lessons/search?q=${newQuery}`);
                if (!response.ok) throw new Error('Search failed');
                
                let data = await response.json();

                data.forEach(lesson => {
                    lesson.image = `${backendUrl}/images/${lesson.image}`;
                });

                lessons.value = data; 
            } catch (error) {
                console.error('Search error:', error);
            }
        });

        onMounted(() => {
            fetchLessons();
        });

        const filteredLessons = computed(() => {
            return lessons.value; 
        });

        const sortedLessons = computed(() => {
            return [...filteredLessons.value].sort((a, b) => {
                let valA = a[sortAttribute.value];
                let valB = b[sortAttribute.value];
                let comparison = 0;
                if (typeof valA === 'string') {
                    comparison = valA.localeCompare(valB);
                } else {
                    comparison = valA - valB;
                }
                return sortOrder.value === 'descending' ? -comparison : comparison;
            });
        });

        const isFirstNameInvalid = computed(() => firstName.value.length > 0 && /\d/.test(firstName.value));
        const isLastNameInvalid = computed(() => lastName.value.length > 0 && /\d/.test(lastName.value));
        const isPhoneNumberInvalid = computed(() => phoneNumber.value.length > 0 && /\D/.test(phoneNumber.value));
        
        const isFormValid = computed(() => {
            return firstName.value.trim() !== '' &&
                   lastName.value.trim() !== '' &&
                   phoneNumber.value.trim() !== '' &&
                   !isFirstNameInvalid.value &&
                   !isLastNameInvalid.value &&
                   !isPhoneNumberInvalid.value;
        });

        const startMessageProgress = () => {
            const duration = 3000;
            const interval = 50;
            const decrement = (interval / duration) * 100;
            messageProgress.value = 100;
            if (messageTimeout.value) clearInterval(messageTimeout.value);
            messageTimeout.value = setInterval(() => {
                messageProgress.value -= decrement;
                if (messageProgress.value <= 0) {
                    clearInterval(messageTimeout.value);
                    addedToCartMessage.value = '';
                }
            }, interval);
        };

        const addToCart = (lesson) => {
            if (lesson.space > 0) {
                const cartItem = cart.value.find(item => item._id === lesson._id);
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    cart.value.push({ ...lesson, quantity: 1 });
                }
                lesson.space--; 
                addedToCartMessage.value = `${lesson.topic} was added to your cart!`;
                startMessageProgress();
            }
        };
        
        const removeFromCart = (cartItem) => {
            const index = cart.value.indexOf(cartItem);
            if (index > -1) {
                const lesson = lessons.value.find(l => l._id === cartItem._id);
                if (lesson) {
                    lesson.space += cartItem.quantity; 
                }
                cart.value.splice(index, 1); 
            }
        };

        const checkout = async () => {
            if (!isFormValid.value) return;

            console.log('Starting checkout...');
            serverErrors.value = []; 

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

                const updatePromises = cart.value.map(cartItem => {
                    const lesson = lessons.value.find(l => l._id === cartItem._id);
                    
                    const newSpace = lesson ? lesson.space : cartItem.space;
                    
                    return fetch(backendUrl + '/lessons/' + cartItem._id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ space: newSpace })
                    });
                });
                
                await Promise.all(updatePromises);
                console.log('All lesson spaces updated');

                cart.value = [];
                firstName.value = '';
                lastName.value = '';
                phoneNumber.value = '';
                checkoutMessage.value = 'Order submitted successfully!';
                setTimeout(() => checkoutMessage.value = '', 5000);

            } catch (error) {
                console.error('Checkout failed:', error);
                serverErrors.value = [error.message];
                checkoutMessage.value = 'Checkout failed. Please try again.';
                
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