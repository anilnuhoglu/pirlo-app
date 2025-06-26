<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useMenuStore } from '../stores/menuStore'
import ProductPopUp from '../components/ProductPopUp.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

const menuStore = useMenuStore()
const activeCategory = ref(null)
const productPopup = ref(null)
const swiperModules = [FreeMode, Navigation]

const scrollActiveToStart = () => {
    const swiper = document.querySelector('.swiper')?.swiper
    const activeIndex = categories.value?.findIndex(category => 
        category.name === activeCategory.value
    )
    
    if (activeIndex !== undefined && activeIndex >= 0) {
        swiper?.slideTo(activeIndex)
    }
}

watch(activeCategory, () => {
    setTimeout(scrollActiveToStart, 200)
})

onMounted(() => {
    if (!menuStore.menu) {
        menuStore.fetchMenu()
    }
})

const categories = computed(() => menuStore.menu?.categories)

const selectedCategory = computed(() => {
    return categories.value?.find(category => category.name === activeCategory.value)
})

const openProductPopup = (product) => {
    productPopup.value = product
}

const closeProductPopup = () => {
    productPopup.value = null
}
</script>

<template>
    <div class="menu-container">
        <div class="menu-images">
            <img 
                v-for="i in 4" 
                :key="i"
                :src="`/src/assets/menu/menu${i}.jpeg`" 
                :alt="`Menu ${i}`"
                class="menu-image"
            />
        </div>

        <!-- <div v-if="!activeCategory" class="menu-content">
            <div class="category-grid">
                <div 
                    v-for="category in categories" 
                    :key="category.name" 
                    class="category-item"
                    @click="activeCategory = category.name"
                >
                    <div class="category-content">
                        <img :src="category.image" alt="Category Image" class="category-image">
                        <div class="category-title">{{ category.name }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="category-page">
            <div class="category-nav-container">
                <Swiper
                    :modules="swiperModules"
                    :slides-per-view="2"
                    :space-between="20"
                    :free-mode="true"
                    :navigation="true"
                    class="category-nav"
                >
                    <SwiperSlide 
                        v-for="category in categories" 
                        :key="category.id"
                        class="category-nav-item"
                    >
                        <div 
                            class="category-nav-link" 
                            :class="{ 'active': category.name === activeCategory }"
                            @click="activeCategory = category.name"
                        >
                            <img :src="category.image" :alt="category.name" class="category-nav-image">
                            <div class="category-nav-link-text">{{ category.name }}</div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            <div class="back-button" @click="activeCategory = null">
                <font-awesome-icon icon="arrow-left" /> Geri
            </div>

            <div class="category-products">
                <div 
                    class="category-product" 
                    v-for="product in selectedCategory?.products" 
                    :key="product.id"
                >
                    <img :src="product.image" alt="Product Image">
                    <div class="product-info">
                        <div class="product-name">{{ product.name }}</div>
                        <div class="product-description">{{ product.description }}</div>
                        <div class="product-price">{{ product.price }} ₺</div>
                    </div>
                    <button @click="openProductPopup(product)">
                        <font-awesome-icon icon="eye" />
                    </button>
                </div>
            </div>
        </div>

        <ProductPopUp 
            v-if="productPopup" 
            :product="productPopup" 
            @close="closeProductPopup" 
        /> -->
    </div>
</template>

<style scoped>
.menu-container {
  width: 100%;
  padding: 20px;
}

.menu-images {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.menu-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 1.5rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}

.category-item {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.category-content {
  display: flex;
  align-items: center;
}

.category-link{
    text-decoration: none;
}

.category-image {
  width: 100%;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  opacity: 0.5;
}

.category-content{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 12px;    
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.category-title{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #E8D8C3;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
}

/* CategoryPage styles */
.category-page {
    padding: 20px;
    max-width: 100vw;
    width: 100%;
}

.back-button {
    margin-bottom: 20px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #722F37;
    color: #E8D8C3;
    border-radius: 8px;
}

.category-nav-container {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    margin-bottom: 20px;
}

.category-nav {
    width: 100%;
    padding: 20px 40px;
}

.category-nav-item {
    width: calc(50% - 10px) !important;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #722F37;
    border-radius: 10px;
    overflow: hidden;
}

.category-nav-link {
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 10px;
    color: #E8D8C3;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.category-nav-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
}

.category-nav-link-text {
    font-size: 1.25rem;
    font-weight: 600;
    position: relative;
    z-index: 1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.category-nav-link.active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(232, 216, 195, 0.3);
}

.category-products {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.category-product {
    width: auto;
    height: 300px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    background-color: #ffe6d3;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #ffe6d3;
}

.category-product img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.product-info {
    padding: 10px;
}

.product-name {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.product-price {
    font-size: 0.9rem;
    color: #722F37;
    font-weight: 600;
    margin-bottom: 4px;
}

.product-description {
    font-size: 0.8rem;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10px;
}

.category-product button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #722F37;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: #722F37;
    background: rgba(232, 216, 195, 0.8);
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
    font-size: 16px;
    font-weight: bold;
}

:deep(.swiper-button-disabled) {
    opacity: 0.35;
}
</style>
