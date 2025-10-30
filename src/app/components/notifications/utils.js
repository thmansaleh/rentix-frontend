import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Settings, 
  Info,
  Clipboard,
  User,
  Calendar,
  FileText
} from 'lucide-react'

/**
 * Get icon component based on notification type
 */
export const getTypeIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'system':
      return <Settings className="h-4 w-4 text-blue-500" />
    default:
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

/**
 * Get icon component based on related type
 */
export const getRelatedIcon = (relatedType) => {
  switch (relatedType) {
    case 'task':
      return <Clipboard className="h-3 w-3" />
    case 'client request':
      return <User className="h-3 w-3" />
    case 'employee':
      return <User className="h-3 w-3" />
    case 'event':
      return <Calendar className="h-3 w-3" />
    case 'memo':
      return <FileText className="h-3 w-3" />
    default:
      return null
  }
}

/**
 * Format date to relative time string
 */
export const formatTimeAgo = (dateString, isArabic = false) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return isArabic ? 'الآن' : 'Now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return isArabic ? `منذ ${minutes} دقيقة` : `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return isArabic ? `منذ ${hours} ساعة` : `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return isArabic ? `منذ ${days} يوم` : `${days}d ago`
  }
}
