const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // --- STATE ---
        const lessons = ref([
            { _id: '1', topic: 'Math', location: 'Hendon', price: 100, space: 5, image: 'maths_school.jpg' },
            { _id: '2', topic: 'English', location: 'Colindale', price: 80, space: 5, image: 'english.jpg' },
            { _id: '3', topic: 'Physics', location: 'Brent Cross', price: 120, space: 5, image: 'physics.jpg' },
            { _id: '4', topic: 'Chemistry', location: 'Golders Green', price: 95, space: 5, image: 'chemistry.jpg' },
            { _id: '5', topic: 'Biology', location: 'Edgware', price: 110, space: 5, image: 'biology.jpg' },
            { _id: '6', topic: 'Art', location: 'Finchley', price: 75, space: 5, image: 'art.jpg' },
            { _id: '7', topic: 'History', location: 'Wembley', price: 90, space: 5, image: 'history.jpg' },
            { _id: '8', topic: 'Geography', location: 'Harrow', price: 85, space: 5, image: 'geography.jpg' },
            { _id: '9', topic: 'Music', location: 'Camden', price: 130, space: 5, image: 'music.png'},
            { _id: '10', topic: 'PE', location: 'Islington', price: 60, space: 5, image: 'pe.jpg' },
        ]);
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

        // --- COMPUTED PROPERTIES ---
        const filteredLessons = computed(() => {
            if (!searchQuery.value) return lessons.value;
            const query = searchQuery.value.toLowerCase();
            return lessons.value.filter(l => l.topic.toLowerCase().includes(query) || l.location.toLowerCase().includes(query));
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

        // --- METHODS ---
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
                if (cartItem) cartItem.quantity++;
                else cart.value.push({ ...lesson, quantity: 1 });
                lesson.space--;
                addedToCartMessage.value = `${lesson.topic} was added to your cart!`;
                startMessageProgress();
            }
        };
        
        const removeFromCart = (cartItem) => {
            const index = cart.value.indexOf(cartItem);
            if (index > -1) {
                const lesson = lessons.value.find(l => l._id === cartItem._id);
                if (lesson) lesson.space += cartItem.quantity;
                cart.value.splice(index, 1);
            }
        };

        const checkout = () => {
            if (isFormValid.value) {
                console.log('Order Submitted:', {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    phone: phoneNumber.value,
                    items: cart.value.map(i => ({id: i._id, qty: i.quantity}))
                });
                cart.value.forEach(cartItem => {
                    const lesson = lessons.value.find(l => l._id === cartItem._id);
                    if (lesson) lesson.space += cartItem.quantity;
                });
                cart.value = [];
                firstName.value = '';
                lastName.value = '';
                phoneNumber.value = '';
                checkoutMessage.value = 'Order submitted successfully!';
                setTimeout(() => checkoutMessage.value = '', 5000);
            }
        };
        
        return {
            lessons, cart, showLessons, addedToCartMessage, messageProgress,
            sortAttribute, sortOrder, searchQuery,
            firstName, lastName, phoneNumber, checkoutMessage,
            filteredLessons, sortedLessons,
            isFirstNameInvalid, isLastNameInvalid, isPhoneNumberInvalid, isFormValid,
            addToCart, removeFromCart, checkout
        };
    }
}).mount('#app');