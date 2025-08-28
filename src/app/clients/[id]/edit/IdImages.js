import { useState, useRef } from 'react'
import { Camera, CreditCard, BookOpen, IdCard } from 'lucide-react'

function IdImages() {
  const [images, setImages] = useState({
    idFront: null,
    idBack: null,
    passportFront: null,
    passportBack: null
  })
  
  const fileInputRefs = {
    idFront: useRef(null),
    idBack: useRef(null),
    passportFront: useRef(null),
    passportBack: useRef(null)
  }

  const maxFileSize = 5 * 1024 * 1024 // 5MB

  const imageSlots = [
    { 
      key: 'idFront', 
      label: 'الهوية - الوجه الأمامي',
      icon: CreditCard,
      placeholder: 'رفع صورة الهوية الأمامية'
    },
    { 
      key: 'idBack', 
      label: 'الهوية - الوجه الخلفي',
      icon: CreditCard,
      placeholder: 'رفع صورة الهوية الخلفية'
    },
    { 
      key: 'passportFront', 
      label: 'جواز السفر - الوجه الأمامي',
      icon: BookOpen,
      placeholder: 'رفع صورة جواز السفر الأمامية'
    },
    { 
      key: 'passportBack', 
      label: 'جواز السفر - الوجه الخلفي',
      icon: BookOpen,
      placeholder: 'رفع صورة جواز السفر الخلفية'
    }
  ]

  const handleFileSelect = (event, imageType) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > maxFileSize) {
      alert(`الملف ${file.name} كبير جداً. يجب أن لا يزيد حجم الصورة عن 5 ميجابايت.`)
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage = {
        id: Date.now() + Math.random(),
        file: file,
        url: e.target.result,
        name: file.name
      }
      setImages(prev => ({
        ...prev,
        [imageType]: newImage
      }))
    }
    reader.readAsDataURL(file)

    // Clear the input
    if (fileInputRefs[imageType].current) {
      fileInputRefs[imageType].current.value = ''
    }
  }

  const removeImage = (imageType) => {
    setImages(prev => ({
      ...prev,
      [imageType]: null
    }))
  }

  const removeAllImages = () => {
    setImages({
      idFront: null,
      idBack: null,
      passportFront: null,
      passportBack: null
    })
  }

  const handleBoxClick = (imageType) => {
    fileInputRefs[imageType].current?.click()
  }

  const uploadedCount = Object.values(images).filter(img => img !== null).length

  return (
    <div className=" my-4">
      <div className="">
 <h4 className="text-lg font-semibold mb-4  flex items-center gap-2">
          <IdCard className="w-5 h-5" />
          صور الهوية / الجواز
        </h4>     
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">تم رفع {uploadedCount} من 4 صور</span>
          {uploadedCount > 0 && (
            <button 
              onClick={removeAllImages}
              className="text-red-500 hover:text-red-700 text-sm underline"
            >
              حذف جميع الصور
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {imageSlots.map((slot, index) => {
          const image = images[slot.key]
          const IconComponent = slot.icon

          return (
            <div key={slot.key} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                {slot.label}
              </label>
              
              <div
                className={`
                  relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
                  transition-all duration-200 hover:border-blue-400 hover:bg-blue-50
                  ${image ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}
                `}
                onClick={() => handleBoxClick(slot.key)}
              >
                <input
                  ref={fileInputRefs[slot.key]}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, slot.key)}
                  className="hidden"
                />

                {image ? (
                  <>
                    <div
                      className="w-full h-full rounded-lg bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${image.url})` }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(slot.key)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {image.name}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <IconComponent size={40} className="mb-3 text-gray-400" />
                    <p className="text-center text-sm font-medium mb-1">
                      {slot.placeholder}
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                      انقر لاختيار صورة<br />
                      أو اسحب وأفلت هنا
                    </p>
                  </div>
                )}

                {/* Drag and drop overlay */}
                <div 
                  className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg opacity-0 pointer-events-none transition-opacity duration-200"
                  onDragEnter={(e) => {
                    e.preventDefault()
                    e.currentTarget.style.opacity = '1'
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.currentTarget.style.opacity = '0'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.style.opacity = '0'
                    const files = Array.from(e.dataTransfer.files)
                    if (files.length > 0) {
                      const mockEvent = { target: { files: [files[0]] } }
                      handleFileSelect(mockEvent, slot.key)
                    }
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress indicator */}
      {/* <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>التقدم</span>
          <span>{uploadedCount}/4</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(uploadedCount / 4) * 100}%` }}
          />
        </div>
      </div> */}

      {/* Validation message */}
      {/* {uploadedCount === 4 && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
          ✅ تم رفع جميع الصور المطلوبة بنجاح
        </div>
      )} */}
    </div>
  )
}

export default IdImages