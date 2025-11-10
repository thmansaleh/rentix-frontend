import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card.jsx";

/**
 * PaginationControls component for page navigation
 * @param {Object} props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onNextPage - Callback for next page
 * @param {Function} props.onPreviousPage - Callback for previous page
 * @param {Object} props.translations - Translation object
 */
export default function PaginationControls({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  translations: t,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="hover:bg-blue-50"
          >
            {t("previous")}
          </Button>
          <div className="px-4 py-2 bg-blue-50 rounded-md">
            <span className="font-medium text-blue-700">
              {t("page")} {currentPage} {t("of")} {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="hover:bg-blue-50"
          >
            {t("next")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
