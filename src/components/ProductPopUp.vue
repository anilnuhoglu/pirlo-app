<template>
    <div class="product-popup-overlay" @click="closePopup">
        <div class="product-popup-content" @click.stop>
            <div class="product-popup-header">
                <h2>{{ product.name }}</h2>
                <button class="close-button" @click="closePopup">&times;</button>
            </div>
            <div class="product-popup-body">
                <img :src="product.image" alt="Product Image" class="product-image">
                <p class="product-description">{{ product.description }}</p>
                <p class="product-price">₺{{ product.price }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close'])

const closePopup = () => {
    emit('close')
}
</script>

<style scoped>
.product-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(26, 26, 26, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
}

.product-popup-content {
    background-color: #1a1a1a;
    padding: 24px;
    border-radius: 12px;
    min-width: 300px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(232, 216, 195, 0.1);
}

.product-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(232, 216, 195, 0.1);
}

.product-popup-header h2 {
    margin: 0;
    color: #E8D8C3;
    font-size: 1.5rem;
    font-weight: 500;
}

.close-button {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #E8D8C3;
    padding: 4px 8px;
    transition: all 0.3s ease;
    border-radius: 4px;
}

.close-button:hover {
    background-color: rgba(232, 216, 195, 0.1);
}

.product-popup-body {
    color: #E8D8C3;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.product-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
}

.product-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #E8D8C3;
    margin: 0;
}

.product-price {
    font-size: 1.25rem;
    font-weight: 600;
    color: #722F37;
    margin: 0;
}

@media (max-width: 768px) {
    .product-popup-overlay {
        padding: 16px;
    }

    .product-popup-content {
        padding: 20px;
        max-width: 100%;
    }

    .product-popup-header {
        margin-bottom: 20px;
        padding-bottom: 12px;
    }

    .product-popup-header h2 {
        font-size: 1.3rem;
    }

    .product-image {
        height: 200px;
    }

    .product-description {
        font-size: 0.95rem;
    }

    .product-price {
        font-size: 1.1rem;
    }
}
</style>