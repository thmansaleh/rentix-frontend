import { useState, useRef } from 'react'
 import './ImageUploader.css'
import { Camera } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { useSelector, useDispatch } from 'react-redux'
import { setCarImages, addCarImage, removeCarImage } from '@/redux/slices/addCarSlice'

function ImageUploader() {
  const t = useTranslations();
  
  const dispatch = useDispatch()
  const images = useSelector(state => state.addCar?.carImages || [])
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const fileInputRef = useRef(null)
  const maxImages = 10
  const minImages = 2
  const maxFileSize = 5 * 1024 * 1024 // 5MB

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    processFiles(files)
  }

  const processFiles = (files) => {
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        alert(t.cars.carAddForm.imageUploader.alerts.fileTooLarge.replace('{fileName}', file.name))
        return false
      }
      return file.type.startsWith('image/')
    })

    if (images.length + validFiles.length > maxImages) {
      alert(t.cars.carAddForm.imageUploader.alerts.maxImagesExceeded.replace('{maxImages}', maxImages))
      return
    }

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          url: e.target.result,
          name: file.name
        }
        // addCarImage reducer will assign order/isPrimary, but include defaults here as well
        dispatch(addCarImage({ ...newImage, order: images.length + 1, isPrimary: images.length === 0 }))
      }
      reader.readAsDataURL(file)
    })

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    
  if (draggedIndex === null) return

  const newImages = [...images]
  const draggedImage = newImages[draggedIndex]

  // Remove dragged item
  newImages.splice(draggedIndex, 1)

  // Insert at new position
  newImages.splice(dropIndex, 0, draggedImage)

  // ensure order/isPrimary normalized by reducer
  dispatch(setCarImages(newImages))
  setDraggedIndex(null)
  }

  // Touch event handlers for mobile
  const handleTouchStart = (e, index) => {
    setDraggedIndex(index)
    const touch = e.touches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      index: index
    })
  }

  const handleTouchMove = (e) => {
    if (!touchStart) return
    e.preventDefault()
    
    const touch = e.touches[0]
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY
    })
  }

  const handleTouchEnd = (e, dropIndex) => {
    if (!touchStart || !touchEnd || draggedIndex === null) {
      setTouchStart(null)
      setTouchEnd(null)
      setDraggedIndex(null)
      return
    }

    // Calculate if it's a significant movement
    const deltaX = Math.abs(touchEnd.x - touchStart.x)
    const deltaY = Math.abs(touchEnd.y - touchStart.y)
    
    if (deltaX > 50 || deltaY > 50) {
      // This was a drag, perform the reorder
      const newImages = [...images]
      const draggedImage = newImages[draggedIndex]

      // Remove dragged item
      newImages.splice(draggedIndex, 1)

      // Insert at new position
      newImages.splice(dropIndex, 0, draggedImage)

      // normalize via reducer
      dispatch(setCarImages(newImages))
    }

    setTouchStart(null)
    setTouchEnd(null)
    setDraggedIndex(null)
  }

  const moveToFirst = (index) => {
    if (index === 0) return // Already first

    const newImages = [...images]
    const imageToMove = newImages[index]

    // Remove from current position
    newImages.splice(index, 1)

    // Insert at beginning
    newImages.unshift(imageToMove)

    dispatch(setCarImages(newImages))
  }

  const removeImage = (imageId) => {
    const idx = images.findIndex(img => img.id === imageId)
    if (idx !== -1) dispatch(removeCarImage(idx))
  }

  const removeAllImages = () => {
  dispatch(setCarImages([]))
  }

  const handleAddBoxClick = (e) => {
    
    fileInputRef.current?.click()
  }

  const remainingCount = maxImages - images.length

  return (
    <div className="box-div-uploader">
      <div className="image-uploader">
        <div className="box-container-note">
          <div className="error-span-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path className="path-white-color" d="M10.952,16H5.048c-0.164,0-0.322-0.065-0.438-0.182L0.182,11.39C0.065,11.274,0,11.116,0,10.952V5.048C0,4.884,0.065,4.726,0.182,4.61L4.61,0.182C4.726,0.065,4.884,0,5.048,0h5.904c0.164,0,0.322,0.065,0.438,0.182l4.428,4.428C15.935,4.726,16,4.884,16,5.048v5.904c0,0.164-0.065,0.322-0.182,0.438l-4.428,4.428C11.274,15.935,11.116,16,10.952,16z" />
              <path className="path-red-color" d="M10.657,15.2H5.343c-0.148,0-0.29-0.058-0.394-0.164l-3.985-3.985C0.859,10.947,0.8,10.804,0.8,10.657V5.343c0-0.148,0.058-0.29,0.164-0.394l3.985-3.985C5.053,0.859,5.196,0.8,5.343,0.8h5.314c0.148,0,0.29,0.058,0.394,0.164l3.985,3.985C15.142,5.053,15.2,5.196,15.2,5.343v5.314c0,0.148-0.058,0.29-0.164,0.394l-3.985,3.985C10.947,15.142,10.804,15.2,10.657,15.2zM5.575,14.084h4.852l3.659-3.659V5.575l-3.659-3.659H5.575L1.916,5.575v4.852L5.575,14.084z M8,11.734c-0.41,0-0.743-0.333-0.743-0.743v-0.017c0-0.41,0.333-0.743,0.743-0.743c0.41,0,0.743,0.333,0.743,0.743v0.017C8.743,11.401,8.41,11.734,8,11.734z M8,9.195c-0.308,0-0.558-0.25-0.558-0.558V4.705c0-0.308,0.25-0.558,0.558-0.558c0.308,0,0.558,0.25,0.558,0.558v3.932C8.558,8.946,8.308,9.195,8,9.195z" />
            </svg>
          </div>
          <div className="error-span-text">
            <p className="textmorenone">• {t('cars.carAddForm.imageUploader.rules.0').replace('{minImages}', minImages).replace('{maxImages}', maxImages)}</p>
            <p className="textmorenone">• {t('cars.carAddForm.imageUploader.rules.1')}</p>
            <p className="textmorenone">• {t('cars.carAddForm.imageUploader.rules.2')}</p>
            <p className="textmorenone">• {t('cars.carAddForm.imageUploader.rules.3')}</p>
          </div>
        </div>
        
        <div className="image-grid" id="image-grid">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="image-box uploaded-image"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, index)}
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                cursor: 'move',
                userSelect: 'none',
                touchAction: 'none'
              }}
            >
            <button  
                            onClick={() => removeImage(image.id)}

             className="remove-btn"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>
              {index === 0 && (
               <div  className="cover-label">{t('cars.carAddForm.imageUploader.coverLabel')}</div>
               
              )}
              {/* {index !== 0 && (
                <button 
                  className="make-cover-btn"
                  onClick={() => moveToFirst(index)}
                  title="جعل هذه صورة الغلاف"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M3 12h18M3 18h18"/>
                  </svg>
                </button>
              )} */}
              <div  className="number-label">{index + 1}</div>
            </div>
          ))}
          
          {images.length < maxImages && (
            <div 
              className="image-box add-box" 
              style={{ display: "flex", cursor: "pointer" }}
              onClick={handleAddBoxClick}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                id="image-input" 
                multiple 
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path className="path-white-up" d="M22.751,4.158C22.407,3.411,21.78,2.8,21.024,2.475c-0.771-0.337-1.67-0.366-2.462-0.083c-0.678,0.238-1.273,0.702-1.673,1.298c-0.346,0.506-0.537,1.108-0.576,1.718v0.328c0.038,0.592,0.218,1.177,0.545,1.673c0.395,0.61,0.993,1.089,1.677,1.336c0.682,0.25,1.447,0.27,2.141,0.055c1.171-0.349,2.104-1.381,2.325-2.584C23.136,5.526,23.049,4.795,22.751,4.158z M23.25,9.163v9.312l-1.682,1.6H0.75V8.267l3.901-3.723h10.082c-0.055,0.258-0.091,0.519-0.108,0.782v0.492c0.057,0.888,0.327,1.765,0.818,2.509c0.593,0.916,1.489,1.633,2.516,2.004c1.024,0.375,2.17,0.405,3.212,0.082C21.957,10.179,22.671,9.739,23.25,9.163z" />
                <path className="path-black-up" d="M23.25,9.163c0.001,2.616,0.001,5.233-0.001,7.849c0.003,0.596-0.283,1.178-0.749,1.547c-0.001-2.927,0-5.853,0-8.78c-0.238,0.16-0.489,0.3-0.75,0.417c0.001,2.772,0.001,5.545-0.001,8.317c0.001,0.594-0.287,1.172-0.749,1.543c-0.001-3.199,0-6.397,0-9.596c-0.246,0.067-0.498,0.113-0.751,0.142c0.001,2.65,0.001,5.3,0,7.95c-0.831-0.949-1.66-1.899-2.491-2.848c-0.276-0.321-0.691-0.519-1.116-0.521c-0.43-0.01-0.856,0.18-1.141,0.502c-0.775,0.879-1.544,1.763-2.319,2.642c-1.634-1.87-3.27-3.739-4.903-5.609c-0.157-0.189-0.346-0.357-0.573-0.459c-0.588-0.287-1.348-0.122-1.768,0.377c-1.731,1.971-3.458,3.945-5.188,5.917c0-2.904,0-5.808,0-8.712C0.744,9.501,0.747,9.15,0.874,8.828c0.27-0.756,1.04-1.294,1.843-1.283c4.103-0.002,8.206-0.001,12.309-0.001c-0.102-0.243-0.186-0.494-0.25-0.75c-4.035,0-8.07,0.001-12.105-0.001c0.368-0.466,0.95-0.75,1.544-0.749c3.476-0.002,6.953-0.001,10.429-0.001c-0.008-0.075-0.015-0.15-0.02-0.226V5.326c0.001-0.011,0.002-0.021,0.003-0.032c-3.485,0-6.971,0-10.456-0.001C4.434,4.967,4.796,4.722,5.2,4.614c0.291-0.083,0.596-0.071,0.895-0.071c2.879,0,5.759,0,8.638,0c0.054-0.255,0.126-0.506,0.217-0.75c-3.078,0-6.155,0-9.233,0c-1.075-0.012-2.126,0.681-2.509,1.69c-0.68,0.273-1.237,0.828-1.512,1.507C0.731,7.38,0.041,8.351,0,9.392v10.742c0.038,0.67,0.32,1.325,0.798,1.799c0.568,0.583,1.4,0.853,2.204,0.799c5.093-0.001,10.186,0.001,15.28,0c0.712,0.002,1.418-0.292,1.919-0.798c0.26-0.255,0.457-0.566,0.602-0.899c0.593-0.25,1.102-0.707,1.391-1.284c0.053-0.1,0.086-0.231,0.21-0.265c0.911-0.393,1.537-1.326,1.597-2.311V8.221C23.788,8.563,23.535,8.88,23.25,9.163z" />
                <path className="path-black-up" d="M14.896,10.043c-0.252-0.466-0.714-0.812-1.233-0.922c-0.471-0.101-0.98-0.011-1.384,0.253c-0.396,0.254-0.688,0.664-0.795,1.122c-0.118,0.486-0.026,1.019,0.251,1.436c0.278,0.429,0.742,0.733,1.247,0.811c0.553,0.094,1.143-0.087,1.551-0.471C15.141,11.725,15.3,10.756,14.896,10.043z" />
                <path className="path-red-up" d="M23.602,3.765c-0.44-0.954-1.241-1.735-2.207-2.15c-0.985-0.43-2.134-0.468-3.146-0.106c-0.867,0.304-1.626,0.897-2.138,1.659c-0.442,0.646-0.686,1.416-0.736,2.195v0.419c0.048,0.756,0.278,1.503,0.697,2.138c0.505,0.78,1.268,1.391,2.143,1.707c0.872,0.32,1.848,0.345,2.736,0.07c1.496-0.445,2.688-1.765,2.97-3.301C24.093,5.513,23.982,4.579,23.602,3.765z M21.358,5.363c-0.155,0.176-0.449,0.203-0.63,0.052c-0.2-0.176-0.378-0.376-0.571-0.56c-0.003,0.865,0.002,1.731-0.002,2.596c0.007,0.251-0.22,0.472-0.469,0.466c-0.247,0.004-0.469-0.216-0.464-0.464c-0.006-0.867,0-1.733-0.003-2.6c-0.236,0.205-0.417,0.483-0.695,0.632c-0.397,0.173-0.81-0.343-0.553-0.692c0.441-0.492,0.94-0.931,1.386-1.419c0.156-0.177,0.454-0.189,0.629-0.034c0.442,0.476,0.918,0.921,1.369,1.388C21.524,4.896,21.523,5.193,21.358,5.363z" />
              </svg> */}
              <Camera className='text-black'/>
            </div>
          )}
        </div>
        
        <div className="footer-bar">
          <span id="remaining-count">{remainingCount} {t('cars.carAddForm.imageUploader.remainingImages')}</span>
          <button 
            type="button" 
            className="btn-delete-all effectphones" 
            id="delete-all" 
            disabled={images.length === 0}
            onClick={removeAllImages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M7.1,5H3C2.448,5,2,5.448,2,6s0.448,1,1,1h1.061l0.824,13.187C4.984,21.768,6.295,23,7.879,23h8.242c1.584,0,2.895-1.232,2.994-2.813L19.939,7H21c0.552,0,1-0.448,1-1s-0.448-1-1-1h-1.993c-0.005,0-0.011,0-0.016,0H16.9c-0.463-2.282-2.481-4-4.9-4C9.581,1,7.563,2.718,7.1,5z M9.171,5h5.659C14.417,3.835,13.306,3,12,3S9.583,3.835,9.171,5z M17.935,7H6.064l0.816,13.062C6.914,20.589,7.351,21,7.879,21h8.242c0.528,0,0.965-0.411,0.998-0.938L17.935,7z M14.279,10.01c0.551,0.039,0.966,0.516,0.928,1.067l-0.419,5.985c-0.038,0.551-0.516,0.966-1.067,0.928c-0.551-0.039-0.966-0.516-0.928-1.067l0.419-5.985C13.25,10.387,13.728,9.971,14.279,10.01z M9.721,10.01c0.551-0.039,1.029,0.377,1.067,0.928l0.419,5.985c0.039,0.551-0.377,1.029-0.928,1.067c-0.551,0.038-1.029-0.377-1.067-0.928l-0.419-5.985C8.755,10.526,9.17,10.048,9.721,10.01z" />
            </svg>
          </button>
        </div>
      </div>   
    </div>
  )
}

export default ImageUploader

