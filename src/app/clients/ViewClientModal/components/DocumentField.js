import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Download } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslations } from "@/hooks/useTranslations";

const isImageFile = (url) => {
  if (!url) return false;
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
  return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
};

const downloadFile = async (url, filename, t) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error(t("clients.view.document.failedToDownload"));
  }
};

export function DocumentField({ label, url }) {
  const { t } = useTranslations();

  return (
    <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          {label}
        </Label>
      </div>

      {url ? (
        <div className="p-4 space-y-3">
          {isImageFile(url) ? (
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-inner">
              <img
                src={url}
                alt={label}
                className="w-full h-56 object-contain p-2"
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                  e.target.onerror = null;
                }}
              />
              <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                {t("clients.view.document.image")}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("clients.view.document.documentFile")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("clients.view.document.clickToViewDownload")}
                </p>
              </div>
              <Badge variant="outline">{t("clients.view.document.pdf")}</Badge>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => window.open(url, "_blank")}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t("clients.view.document.view")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadFile(url, label, t)}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {t("clients.view.document.download")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("clients.view.fields.noDocumentUploaded")}
          </p>
        </div>
      )}
    </Card>
  );
}
