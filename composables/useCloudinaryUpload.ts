import { ref } from 'vue'
import imageCompression from 'browser-image-compression'

export const useCloudinaryUpload = () => {
  const isUploading = ref(false)
  const previewImage = ref<string | null>(null)
  const uploadeedImageUrl = ref<string | null>(null)
  const uploadError = ref<string | null>(null)

  /**
   * Handles file selection and creates a preview
   */
  const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = input.files
    
    if (!files || files.length === 0) {
      uploadError.value = 'No file selected'
      return null
    }
    
    isUploading.value = true
    const file = files[0]
    
    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      previewImage.value = reader.result as string
    }
    reader.readAsDataURL(file)
    
    // Process file
    try {
      let fileToUpload = file
      
      // Compress if larger than 1MB
      if (file.size > 1048576) {
        const options = {
          maxSizeMB: 1,
          useWebWorker: true,
        }
        fileToUpload = await imageCompression(file, options)
      }
      
      const result = await uploadToCloudinary(fileToUpload)
      uploadeedImageUrl.value = result.secure_url
      return result
    } catch (error) {
      console.error('Error processing file:', error)
      uploadError.value = error instanceof Error ? error.message : 'Unknown error'
      isUploading.value = false
      return null
    }
  }

  /**
   * Uploads file to Cloudinary via your API
   */
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const result = await $fetch<{ 
        public_id: string, 
        secure_url: string,
        height: number, 
        width: number 
      }>('/api/image', {
        method: 'POST',
        body: formData,
      })
      
      return result
    } catch (error) {
      console.error('Upload Error:', error)
      uploadError.value = 'Failed to upload to Cloudinary'
      throw error
    } finally {
      isUploading.value = false
    }
  }

  /**
   * Resets the upload state
   */
  const resetUpload = () => {
    isUploading.value = false
    previewImage.value = null
    uploadeedImageUrl.value = null
    uploadError.value = null
  }

  return {
    isUploading,
    previewImage,
    uploadeedImageUrl,
    uploadError,
    handleFileSelect,
    uploadToCloudinary,
    resetUpload
  }
}