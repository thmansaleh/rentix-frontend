import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pen, Trash2, File, Check } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"

/**
 * NoticesTable component for displaying the list of judicial notices
 */
export const NoticesTable = ({ notices, onEdit, onDelete }) => {
  const { t } = useTranslations()

  if (!notices || notices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('judicialNotices.noNotices')}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">{t('judicialNotices.certificationDate')}</TableHead>
          <TableHead className="text-center">{t('judicialNotices.noticePeriod')}</TableHead>
          <TableHead className="text-center">{t('judicialNotices.noticeCompleted')}</TableHead>
          <TableHead className="text-center">{t('judicialNotices.lawsuitFiled')}</TableHead>
          <TableHead className="text-center">{t('judicialNotices.attachedFiles')}</TableHead>
          <TableHead className="text-center">{t('judicialNotices.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notices.map((notice, index) => (
          <TableRow key={notice.id}>
            <TableCell className="text-center">
              {notice.certificationDate ? 
                format(new Date(notice.certificationDate), "PPP", { locale: ar }) : 
                t('judicialNotices.notSpecified')
              }
            </TableCell>
            <TableCell className="text-center">
              {notice.noticePeriod || t('judicialNotices.notSpecified')}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                {notice.noticeCompleted ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                {notice.lawsuitFiled ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">
              {notice.files && notice.files.length > 0 ? (
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    <File className="w-3 h-3 mr-1" />
                    {notice.files.length} {notice.files.length === 1 ? 
                      t('files.filesCount') : 
                      t('files.filesCount')
                    }
                  </Badge>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">{t('judicialNotices.noFiles')}</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(index)}
                >
                  <Pen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
