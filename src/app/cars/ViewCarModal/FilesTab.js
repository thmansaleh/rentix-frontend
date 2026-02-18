import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  Image as ImageIcon,
  Download,
  ExternalLink,
} from "lucide-react";
import { formatDate, getDocumentTypeLabel } from "./utils";

export function FilesTab({ photos, documents, t }) {
  return (
    <TabsContent value="files" className="space-y-6 flex-1 overflow-y-auto">
      {/* Photos Section */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                {t("cars.photos.title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t("cars.photos.photoCountAvailable", {
                  count: photos.length,
                })}
              </p>
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {t("cars.photos.noPhotos")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 hover:border-primary transition-colors"
                >
                  <img
                    src={photo.file_url}
                    alt={photo.file_name || `Car photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(photo.file_url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t("cars.documents.title")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t("cars.documents.documentCountAvailable", {
                  count: documents.length,
                })}
              </p>
            </div>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {t("cars.documents.noDocuments")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="border-2 hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded bg-primary/10 mt-1">
                          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <p className="text-sm font-semibold truncate">
                              {doc.file_name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getDocumentTypeLabel(doc.document_type, t)}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            {doc.issue_date && (
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  {t("cars.documents.issueDate")}
                                </Label>
                                <p className="font-medium">
                                  {formatDate(doc.issue_date)}
                                </p>
                              </div>
                            )}
                            {doc.expiry_date && (
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  {t("cars.documents.expiryDate")}
                                </Label>
                                <p className="font-medium">
                                  {formatDate(doc.expiry_date)}
                                </p>
                              </div>
                            )}
                          </div>

                          {doc.notes && (
                            <p className="text-xs text-muted-foreground p-2 bg-muted rounded">
                              {doc.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.file_url, "_blank")}
                        className="flex-shrink-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
