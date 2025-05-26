<template>
    <div class="product-popup">
        <div class="product-popup-content">
            <div class="product-popup-header">
                <h3>{{ product.name }}</h3>
                <button @click="closePopup">
                    <font-awesome-icon icon="fa-solid fa-times" />
                </button>
            </div>
            <div class="product-popup-body">
                <img :src="product.image" alt="Product Image">
                <p>{{ product.description }}</p>
                <p>{{ product.price }}</p>
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
.product-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.product-popup-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
}

.product-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>