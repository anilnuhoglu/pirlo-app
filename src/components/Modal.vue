<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
})

defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
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

.modal-content {
  background-color: #1a1a1a;
  padding: 24px;
  border-radius: 12px;
  min-width: 300px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(232, 216, 195, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(232, 216, 195, 0.1);
}

.modal-header h2 {
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

.modal-body {
  color: #E8D8C3;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Form element styles */
.modal-body :deep(input),
.modal-body :deep(textarea) {
  width: 100%;
  padding: 12px;
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: #E8D8C3;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.modal-body :deep(input:focus),
.modal-body :deep(textarea:focus) {
  outline: none;
  border-color: #722F37;
  box-shadow: 0 0 0 2px rgba(114, 47, 55, 0.2);
}

.modal-body :deep(input[type="file"]) {
  width: 100%;
  padding: 12px;
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: #E8D8C3;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.modal-body :deep(input[type="file"]:hover) {
  background-color: #333333;
}

.modal-body :deep(input[type="file"]:focus) {
  outline: none;
  border-color: #722F37;
  box-shadow: 0 0 0 2px rgba(114, 47, 55, 0.2);
}

/* Hide the default file input button */
.modal-body :deep(input[type="file"]::-webkit-file-upload-button) {
  visibility: hidden;
  width: 0;
}

/* Custom file input button */
.modal-body :deep(input[type="file"]::before) {
  content: 'Dosya Seç';
  display: inline-block;
  background: #722F37;
  color: #E8D8C3;
  padding: 8px 16px;
  border-radius: 6px;
  margin-right: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-body :deep(input[type="file"]:hover::before) {
  background-color: #8B383F;
}

.modal-body :deep(button) {
  margin-top: 8px;
  padding: 12px 24px;
  background-color: #722F37;
  color: #E8D8C3;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-body :deep(button:hover) {
  background-color: #8B383F;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-content {
    padding: 20px;
    max-width: 100%;
  }

  .modal-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
  }

  .modal-header h2 {
    font-size: 1.3rem;
  }

  .modal-body :deep(input),
  .modal-body :deep(textarea) {
    padding: 10px;
    font-size: 0.95rem;
  }
  
  .modal-body :deep(input[type="file"]) {
    padding: 10px;
    font-size: 0.95rem;
  }
  
  .modal-body :deep(input[type="file"]::before) {
    padding: 6px 12px;
  }
}
</style> 