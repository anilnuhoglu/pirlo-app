<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Modal from '../components/Modal.vue'
import { useMenuStore } from '../stores/menuStore'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
const inputPassword = ref('')
const isAuthorized = ref(false)

const menu = ref({
  categories: []
})

const newCategory = ref({
  name: '',
  image: '',
  products: []
})

const newProduct = ref({
  id: '',
  name: '',
  price: 0,
  description: '',
  image: ''
})

const previewMode = ref(false)

// Add new refs for modals
const showCategoryModal = ref(false)
const showProductModal = ref(false)
const selectedCategoryIndex = ref(null)

// Add new refs for edit modals
const showEditCategoryModal = ref(false)
const showEditProductModal = ref(false)
const editingCategory = ref(null)
const editingProduct = ref(null)
const editingCategoryIndex = ref(null)
const editingProductIndex = ref(null)

// Add confirmation modal state
const showSaveConfirmation = ref(false)

// Add confirmation states for edit and delete
const showDeleteCategoryConfirmation = ref(false)
const showDeleteProductConfirmation = ref(false)
const showEditConfirmation = ref(false)
const deletingCategoryIndex = ref(null)
const deletingProductIndices = ref({ categoryIndex: null, productIndex: null })

// Add new ref for expanded categories
const expandedCategories = ref(new Set())

const authorize = () => {
  if (inputPassword.value === ADMIN_PASSWORD) {
    isAuthorized.value = true
    fetchMenu()
  } else {
    alert('Şifre yanlış')
  }
}

const fetchMenu = async () => {
  try {
    const res = await axios.get('https://pirlo-menu-app.s3.eu-central-1.amazonaws.com/menu.json')
    menu.value = res.data
  } catch (err) {
    console.error('Menü verisi alınamadı:', err)
  }
}

const addCategory = () => {
  if (newCategory.value.name) {
    menu.value.categories.push({ ...newCategory.value })
    newCategory.value = { name: '', image: '', products: [] }
  }
}

const removeCategory = (index) => {
  menu.value.categories.splice(index, 1)
}

const addProduct = (categoryIndex) => {
  if (newProduct.value.name) {
    const product = { ...newProduct.value, id: uuidv4() }
    menu.value.categories[categoryIndex].products.push(product)
    newProduct.value = { id: '', name: '', price: 0, description: '', image: '' }
  }
}

const removeProduct = (categoryIndex, productIndex) => {
  menu.value.categories[categoryIndex].products.splice(productIndex, 1)
}

const uploadImage = async (event, target, categoryIndex = null, productIndex = null) => {
  const file = event.target.files[0]
  const ext = file.name.split('.').pop()
  const { data } = await axios.get(`/api/s3-upload-image?ext=${ext}`)
  await axios.put(data.url, file, {
    headers: { 'Content-Type': file.type }
  })
  const imageUrl = data.publicUrl

  if (target === 'category') {
    menu.value.categories[categoryIndex].image = imageUrl
  } else if (target === 'product') {
    menu.value.categories[categoryIndex].products[productIndex].image = imageUrl
  } else if (target === 'newCategory') {
    newCategory.value.image = imageUrl
  } else if (target === 'newProduct') {
    newProduct.value.image = imageUrl
  }
}

const upload = async () => {
  const file = new File([JSON.stringify(menu.value)], "menu.json", { type: "application/json" })
  const { data } = await axios.get('/api/s3-upload-url')
  await axios.put(data.url, file, {
    headers: { 'Content-Type': 'application/json' }
  })
  
  // Import menuStore
  const menuStore = useMenuStore()
  // Reset the store after successful upload
  menuStore.menu = null
  
  alert("Menü başarıyla yüklendi!")
}

// Add function for reordering
const moveItem = (array, fromIndex, toIndex) => {
  const item = array.splice(fromIndex, 1)[0]
  array.splice(toIndex, 0, item)
}

const moveCategory = (index, direction) => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex >= 0 && newIndex < menu.value.categories.length) {
    moveItem(menu.value.categories, index, newIndex)
  }
}

const moveProduct = (categoryIndex, productIndex, direction) => {
  const products = menu.value.categories[categoryIndex].products
  const newIndex = direction === 'up' ? productIndex - 1 : productIndex + 1
  if (newIndex >= 0 && newIndex < products.length) {
    moveItem(products, productIndex, newIndex)
  }
}

const openProductModal = (categoryIndex) => {
  selectedCategoryIndex.value = categoryIndex
  showProductModal.value = true
  newProduct.value = { id: '', name: '', price: 0, description: '', image: '' }
}

// Validation functions
const validateCategory = (category) => {
  return category.name.trim() !== '' && category.image.trim() !== ''
}

const validateProduct = (product) => {
  return product.name.trim() !== '' && 
         product.price > 0 && 
         product.description.trim() !== '' && 
         product.image.trim() !== ''
}

// Updated handlers with validation and confirmation
const handleAddCategory = () => {
  if (!validateCategory(newCategory.value)) {
    alert('Lütfen tüm kategori bilgilerini doldurun')
    return
  }
  addCategory()
  showCategoryModal.value = false
}

const handleAddProduct = () => {
  if (!validateProduct(newProduct.value)) {
    alert('Lütfen tüm ürün bilgilerini doldurun')
    return
  }
  addProduct(selectedCategoryIndex.value)
  showProductModal.value = false
}

const openEditCategoryModal = (category, index) => {
  editingCategory.value = { ...category }
  editingCategoryIndex.value = index
  showEditCategoryModal.value = true
}

const openEditProductModal = (product, categoryIndex, productIndex) => {
  editingProduct.value = { ...product }
  editingCategoryIndex.value = categoryIndex
  editingProductIndex.value = productIndex
  showEditProductModal.value = true
}

const handleEditCategory = () => {
  if (!validateCategory(editingCategory.value)) {
    alert('Lütfen tüm kategori bilgilerini doldurun')
    return
  }
  showEditConfirmation.value = true
}

const handleEditProduct = () => {
  if (!validateProduct(editingProduct.value)) {
    alert('Lütfen tüm ürün bilgilerini doldurun')
    return
  }
  showEditConfirmation.value = true
}

const confirmEdit = () => {
  if (editingCategory.value) {
    menu.value.categories[editingCategoryIndex.value] = { ...editingCategory.value }
    showEditCategoryModal.value = false
  } else if (editingProduct.value) {
    menu.value.categories[editingCategoryIndex.value].products[editingProductIndex.value] = { ...editingProduct.value }
    showEditProductModal.value = false
  }
  showEditConfirmation.value = false
}

const handleDeleteCategory = (index) => {
  deletingCategoryIndex.value = index
  showDeleteCategoryConfirmation.value = true
}

const handleDeleteProduct = (categoryIndex, productIndex) => {
  deletingProductIndices.value = { categoryIndex, productIndex }
  showDeleteProductConfirmation.value = true
}

const confirmDeleteCategory = () => {
  removeCategory(deletingCategoryIndex.value)
  showDeleteCategoryConfirmation.value = false
}

const confirmDeleteProduct = () => {
  removeProduct(deletingProductIndices.value.categoryIndex, deletingProductIndices.value.productIndex)
  showDeleteProductConfirmation.value = false
}

const handleSave = () => {
  showSaveConfirmation.value = true
}

const confirmSave = async () => {
  await upload()
  showSaveConfirmation.value = false
}

// Add toggle function
const toggleCategory = (index) => {
  if (expandedCategories.value.has(index)) {
    expandedCategories.value.delete(index)
  } else {
    expandedCategories.value.add(index)
  }
}
</script>

<template>
  <div class="admin-container">
    <div v-if="!isAuthorized" class="login-container">
      <div class="login-card">
        <input 
          type="password" 
          v-model="inputPassword" 
          placeholder="Şifre" 
          class="input login-input"
          @keyup.enter="authorize"
        />
        <button @click="authorize" class="button login-button">Giriş Yap</button>
      </div>
    </div>

    <div v-else>
      <div class="admin-header">
        <div class="header-content">
          <h1 class="admin-title">Menü Yönetimi</h1>
          <div class="header-buttons">
            <button @click="previewMode = !previewMode" class="preview-button">
              {{ previewMode ? 'Düzenlemeye Dön' : 'Önizleme' }}
            </button>
            <button @click="showCategoryModal = true" class="add-category-button">
              <span class="button-icon">+</span> Yeni Kategori
            </button>
          </div>
        </div>
      </div>

      <div class="content-wrapper" :class="{ 'preview-mode': previewMode }">
        <div v-for="(category, cIndex) in menu.categories" :key="cIndex" 
             :class="['category-card', { 'preview-category': previewMode }]">
          
          <!-- Regular Edit Mode -->
          <template v-if="!previewMode">
            <div class="category-header">
              <div class="category-info">
                <div class="category-controls">
                  <button @click="moveCategory(cIndex, 'up')" :disabled="cIndex === 0" class="order-button">
                    <span class="arrow">↑</span>
                  </button>
                  <button @click="moveCategory(cIndex, 'down')" :disabled="cIndex === menu.categories.length - 1" class="order-button">
                    <span class="arrow">↓</span>
                  </button>
                </div>
                <div class="category-main">
                  <img v-if="category.image" :src="category.image" class="category-image" alt="Category" />
                  <h3 class="category-name">{{ category.name }}</h3>
                </div>
              </div>
              <div class="category-actions">
                <button @click="toggleCategory(cIndex)" class="action-button toggle">
                  {{ expandedCategories.has(cIndex) ? 'Ürünleri Gizle' : 'Ürünleri Göster' }}
                </button>
                <button @click="openEditCategoryModal(category, cIndex)" class="action-button edit">
                  Düzenle
                </button>
                <button @click="handleDeleteCategory(cIndex)" class="action-button delete">
                  Sil
                </button>
              </div>
            </div>

            <div v-if="expandedCategories.has(cIndex)" class="products-section">
              <div class="products-header">
                <h4 class="products-title">Ürünler</h4>
                <button @click="openProductModal(cIndex)" class="add-product-button">
                  <span class="button-icon">+</span> Ürün Ekle
                </button>
              </div>

              <div class="products-grid">
                <div v-for="(product, pIndex) in category.products" 
                     :key="product.id" 
                     class="product-card">
                  <div class="product-order">
                    <button @click="moveProduct(cIndex, pIndex, 'up')" 
                            :disabled="pIndex === 0" 
                            class="order-button small">↑</button>
                    <button @click="moveProduct(cIndex, pIndex, 'down')" 
                            :disabled="pIndex === category.products.length - 1" 
                            class="order-button small">↓</button>
                  </div>
                  <div class="product-content">
                    <img v-if="product.image" :src="product.image" class="product-image" alt="Product" />
                    <div class="product-details">
                      <h4 class="product-name">{{ product.name }}</h4>
                      <p class="product-description">{{ product.description }}</p>
                      <p class="product-price">₺{{ product.price }}</p>
                    </div>
                    <div class="product-actions">
                      <button @click="openEditProductModal(product, cIndex, pIndex)" 
                              class="action-button edit small">
                        Düzenle
                      </button>
                      <button @click="handleDeleteProduct(cIndex, pIndex)" 
                              class="action-button delete small">
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Preview Mode -->
          <template v-else>
            <div class="preview-category-content">
              <img v-if="category.image" :src="category.image" class="preview-category-image" alt="Category" />
              <h3 class="preview-category-name">{{ category.name }}</h3>
            </div>
            <div class="preview-products-grid">
              <div v-for="product in category.products" 
                   :key="product.id" 
                   class="preview-product-card">
                <img :src="product.image" alt="Product Image" class="preview-product-image">
                <div class="preview-product-details">
                  <h2 class="preview-product-name">{{ product.name }}</h2>
                  <p class="preview-product-description">{{ product.description }}</p>
                  <p class="preview-product-price">₺{{ product.price }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <button @click="handleSave" class="save-button">
        Menüyü Kaydet
      </button>

      <!-- Save Confirmation Modal -->
      <Modal :is-open="showSaveConfirmation" title="Menüyü Kaydet" @close="showSaveConfirmation = false">
        <div class="confirmation-content">
          <p>Menüdeki değişiklikleri kaydetmek istediğinizden emin misiniz?</p>
          <div class="confirmation-buttons">
            <button @click="confirmSave" class="admin-button primary">Evet, Kaydet</button>
            <button @click="showSaveConfirmation = false" class="admin-button secondary">İptal</button>
          </div>
        </div>
      </Modal>

      <!-- Category Modal -->
      <Modal :is-open="showCategoryModal" title="Yeni Kategori" @close="showCategoryModal = false">
        <input v-model="newCategory.name" type="text" placeholder="Kategori Adı" class="admin-input" />
        <input type="file" @change="(e) => uploadImage(e, 'newCategory')" class="admin-input" />
        <button @click="handleAddCategory" class="admin-button primary">Ekle</button>
      </Modal>

      <!-- Product Modal -->
      <Modal :is-open="showProductModal" title="Yeni Ürün" @close="showProductModal = false">
        <input v-model="newProduct.name" placeholder="Ürün Adı" class="admin-input" />
        <input v-model.number="newProduct.price" type="number" placeholder="Fiyat" class="admin-input" />
        <input v-model="newProduct.description" placeholder="Açıklama" class="admin-input" />
        <input type="file" @change="(e) => uploadImage(e, 'newProduct')" class="admin-input" />
        <button @click="handleAddProduct" class="admin-button primary">Ekle</button>
      </Modal>

      <!-- Add Edit Category Modal -->
      <Modal :is-open="showEditCategoryModal" title="Kategori Düzenle" @close="showEditCategoryModal = false">
        <input v-model="editingCategory.name" type="text" placeholder="Kategori Adı" class="admin-input" />
        <div class="image-preview" v-if="editingCategory?.image">
          <img :src="editingCategory.image" class="preview-image" />
        </div>
        <input type="file" @change="(e) => uploadImage(e, 'category', editingCategoryIndex)" class="admin-input" />
        <button @click="handleEditCategory" class="admin-button primary">Kaydet</button>
      </Modal>

      <!-- Add Edit Product Modal -->
      <Modal :is-open="showEditProductModal" title="Ürün Düzenle" @close="showEditProductModal = false">
        <input v-model="editingProduct.name" placeholder="Ürün Adı" class="admin-input" />
        <input v-model.number="editingProduct.price" type="number" placeholder="Fiyat" class="admin-input" />
        <input v-model="editingProduct.description" placeholder="Açıklama" class="admin-input" />
        <div class="image-preview" v-if="editingProduct?.image">
          <img :src="editingProduct.image" class="preview-image" />
        </div>
        <input type="file" @change="(e) => uploadImage(e, 'product', editingCategoryIndex, editingProductIndex)" class="admin-input" />
        <button @click="handleEditProduct" class="admin-button primary">Kaydet</button>
      </Modal>

      <!-- Edit Confirmation Modal -->
      <Modal :is-open="showEditConfirmation" title="Değişiklikleri Onayla" @close="showEditConfirmation = false">
        <div class="confirmation-content">
          <p>Yapılan değişiklikleri kaydetmek istediğinizden emin misiniz?</p>
          <div class="confirmation-buttons">
            <button @click="confirmEdit" class="admin-button primary">Evet, Kaydet</button>
            <button @click="showEditConfirmation = false" class="admin-button secondary">İptal</button>
          </div>
        </div>
      </Modal>

      <!-- Delete Category Confirmation Modal -->
      <Modal :is-open="showDeleteCategoryConfirmation" title="Kategoriyi Sil" @close="showDeleteCategoryConfirmation = false">
        <div class="confirmation-content">
          <p>Bu kategoriyi ve içindeki tüm ürünleri silmek istediğinizden emin misiniz?</p>
          <div class="confirmation-buttons">
            <button @click="confirmDeleteCategory" class="admin-button delete">Evet, Sil</button>
            <button @click="showDeleteCategoryConfirmation = false" class="admin-button secondary">İptal</button>
          </div>
        </div>
      </Modal>

      <!-- Delete Product Confirmation Modal -->
      <Modal :is-open="showDeleteProductConfirmation" title="Ürünü Sil" @close="showDeleteProductConfirmation = false">
        <div class="confirmation-content">
          <p>Bu ürünü silmek istediğinizden emin misiniz?</p>
          <div class="confirmation-buttons">
            <button @click="confirmDeleteProduct" class="admin-button delete">Evet, Sil</button>
            <button @click="showDeleteProductConfirmation = false" class="admin-button secondary">İptal</button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  max-width: 1200px;
  padding: 20px;
  width: 100%;
}

.admin-header {
  background-color: #301514;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.admin-title {
  color: #E8D8C3;
  margin: 0;
  font-size: 1.8rem;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.preview-button, .add-category-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.preview-button {
  background-color: #E8D8C3;
  color: #301514;
}

.add-category-button {
  background-color: #722F37;
  color: #E8D8C3;
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-icon {
  font-size: 1.2em;
  font-weight: bold;
}

.content-wrapper {
  display: grid;
  gap: 24px;
}

.category-card {
  background: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.category-header {
  padding: 20px;
  background-color: rgba(114, 47, 55, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.category-name {
  margin: 0;
  font-size: 1.2rem;
  color: #E8D8C3;
}

.products-section {
  padding: 20px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.products-title {
  margin: 0;
  color: #722F37;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: #1a1a1a;
  border: 1px solid rgba(232, 216, 195, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-order {
  display: flex;
  gap: 4px;
  padding: 8px;
  background-color: rgba(114, 47, 55, 0.05);
}

.product-content {
  padding: 12px;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 12px;
}

.product-details {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  margin: 0 0 4px 0;
  color: #E8D8C3;
}

.product-description {
  margin: 8px 0;
  color: #999;
  font-size: 0.9rem;
  line-height: 1.4;
}

.product-price {
  margin: 0;
  color: #722F37;
  font-weight: 500;
}

.action-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.action-button.edit {
  background-color: #E8D8C3;
  color: #722F37;
}

.action-button.delete {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.action-button.small {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.order-button {
  background: none;
  border: 1px solid #722F37;
  color: #722F37;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.order-button:hover:not(:disabled) {
  background-color: #722F37;
  color: #E8D8C3;
}

.order-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #301514;
  color: #E8D8C3;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.save-button:hover {
  background-color: #462220;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-container {
    padding: 10px 10px 80px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-buttons {
    flex-direction: column;
  }

  .category-header {
    flex-direction: column;
    align-items: stretch;
  }

  .category-actions {
    display: flex;
    gap: 8px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .save-button {
    width: calc(100% - 40px);
    bottom: 10px;
    right: 20px;
  }
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #301514;
}

.login-card {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.login-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  font-size: 1rem;
  background: #2a2a2a;
  color: #E8D8C3;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #722F37;
  color: #E8D8C3;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #8B383F;
}

.confirmation-content {
  text-align: center;
  padding: 20px 0;
}

.confirmation-content p {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #E8D8C3;
}

.confirmation-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.admin-button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.admin-button.primary {
  background-color: #722F37;
  color: #E8D8C3;
}

.admin-button.primary:hover {
  background-color: #8B383F;
}

.admin-button.secondary {
  background-color: #E8D8C3;
  color: #722F37;
}

.admin-button.secondary:hover {
  background-color: #D8C8B3;
}

/* Preview Mode Styles */
.content-wrapper.preview-mode {
  padding: 20px;
  grid-template-columns: repeat(2, 1fr);
}

.preview-category {
  background: #1a1a1a;
  padding: 20px;
  margin-bottom: 30px;
}

.preview-category-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #D8C8B3;
}

.preview-category-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
}

.preview-category-name {
  color: #E8D8C3;
  font-size: 1.5rem;
  margin: 0;
}

.preview-products-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.preview-product-card {
  width: 200px;
  background: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #D8C8B3;
  padding: 10px;
}

.preview-product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.preview-product-details {
  padding: 15px;
}

.preview-product-name {
  color: #E8D8C3;
  font-size: 1.2rem;
  margin: 0 0 8px 0;
}

.preview-product-description {
  color: #999;
  font-size: 0.9rem;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.preview-product-price {
  color: #722F37;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

@media (max-width: 768px) {
  .preview-products-grid {
    justify-content: center;
  }
  
  .preview-product-card {
    width: 100%;
    max-width: 300px;
  }

  .content-wrapper.preview-mode {
    grid-template-columns: repeat(1, 1fr);
  }
}

.action-button.toggle {
  background-color: #301514;
  color: #E8D8C3;
  margin-right: 8px;
}

.action-button.toggle:hover {
  background-color: #462220;
}

.category-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.add-product-button {
  background-color: #722F37;
  color: #E8D8C3;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.add-product-button:hover {
  background-color: #8B383F;
}
</style>
