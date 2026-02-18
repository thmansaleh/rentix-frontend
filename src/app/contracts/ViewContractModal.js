"use client";

import { useState, useEffect } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, FileText, Download, User, Car, Calendar, DollarSign, Gauge, Fuel, Clock, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { getContractById, getContractAttachments } from "../services/api/contracts";
import { useTranslations } from "@/hooks/useTranslations";

export function ViewContractModal({ isOpen, onClose, contractId }) {
  const { t } = useTranslations();
  const [contract, setContract] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contractId && isOpen) {
      loadContractData();
      loadAttachments();
    } else if (!isOpen) {
      setContract(null);
      setAttachments([]);
    }
  }, [contractId, isOpen]);

  const loadContractData = async () => {
    setIsLoading(true);
    try {
      const data = await getContractById(contractId);
      setContract(data);
    } catch (error) {
      console.error("Error loading contract:", error);
      toast.error(t('contracts.errorLoading'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttachments = async () => {
    try {
      const data = await getContractAttachments(contractId);
      setAttachments(data || []);
    } catch (error) {
      console.error("Error loading attachments:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  const getStatusVariant = (status) => {
    const variants = {
      draft: "outline",
      active: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return variants[status] || "default";
  };

  const calculateDuration = () => {
    if (!contract?.start_date || !contract?.end_date) return "-";
    const start = new Date(contract.start_date);
    const end = new Date(contract.end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const InfoRow = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-start gap-3 ${className}`}>
      {Icon && (
        <div className="p-2 bg-primary/10 rounded-lg mt-1">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground mt-1 break-words">{value}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <CustomModal isOpen={isOpen} onClose={onClose} title={t('contracts.viewModal.title')} size="xl">
        <CustomModalBody className="h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('contracts.viewModal.loadingDetails')}</p>
          </div>
        </CustomModalBody>
        <CustomModalFooter>
          <Button variant="outline" onClick={onClose}>
            {t('contracts.viewModal.close')}
          </Button>
        </CustomModalFooter>
      </CustomModal>
    );
  }

  if (!contract) {
    return null;
  }

  return (
    <CustomModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${t('contracts.contractNumber')}${contract.contract_number}`}
      size="xl"
    >
      <CustomModalBody className="h-[70vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Status Banner */}
          <Card className="border-2 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('contracts.viewModal.contractStatus')}</p>
                  <Badge variant={getStatusVariant(contract.status)} className="mt-2 text-base px-4 py-1">
                    {contract.status === 'draft' && t('contracts.statusDraft').toUpperCase()}
                    {contract.status === 'active' && t('contracts.statusActive').toUpperCase()}
                    {contract.status === 'completed' && t('contracts.statusCompleted').toUpperCase()}
                    {contract.status === 'cancelled' && t('contracts.statusCancelled').toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t('contracts.viewModal.duration')}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{calculateDuration()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Car Information */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('contracts.viewModal.customerVehicle')}</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">{t('contracts.viewModal.customerDetails')}</h3>
                  <InfoRow 
                    label={t('contracts.customerName')} 
                    value={contract.customer_name || "-"} 
                  />
                  <InfoRow 
                    label={t('contracts.viewModal.phoneNumber')} 
                    value={contract.customer_phone || "-"} 
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">{t('contracts.viewModal.vehicleDetails')}</h3>
                  <InfoRow 
                    icon={Car}
                    label={t('contracts.carDetails')} 
                    value={contract.car_details || "-"} 
                  />
                  <InfoRow 
                    label={t('contracts.plateNumber')} 
                    value={contract.plate_number || "-"} 
                  />
                </div>
              </div>

              {contract.branch_name && (
                <>
                  <Separator className="my-4" />
                  <InfoRow 
                    icon={MapPin}
                    label={t('contracts.addModal.branch')} 
                    value={contract.branch_name} 
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Contract Period */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('contracts.viewModal.contractPeriod')}</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">{t('contracts.viewModal.start')}</h3>
                  <InfoRow 
                    label={t('contracts.startDate')} 
                    value={formatDate(contract.start_date)} 
                  />
                  {contract.start_time && (
                    <InfoRow 
                      icon={Clock}
                      label={t('contracts.addModal.startTime')} 
                      value={formatTime(contract.start_time)} 
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">{t('contracts.viewModal.end')}</h3>
                  <InfoRow 
                    label={t('contracts.endDate')} 
                    value={formatDate(contract.end_date)} 
                  />
                  {contract.end_time && (
                    <InfoRow 
                      icon={Clock}
                      label={t('contracts.addModal.endTime')} 
                      value={formatTime(contract.end_time)} 
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Gauge className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('contracts.viewModal.vehicleCondition')}</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoRow 
                  label={t('contracts.viewModal.kmAllowed')} 
                  value={contract.km_allowed ? `${contract.km_allowed} km` : "-"} 
                />
                <InfoRow 
                  label={t('contracts.viewModal.kmAtStart')} 
                  value={contract.km_taken_start ? `${contract.km_taken_start} km` : "-"} 
                />
                <InfoRow 
                  label={t('contracts.viewModal.kmAtReturn')} 
                  value={contract.km_return_end ? `${contract.km_return_end} km` : "-"} 
                />
              </div>

              <Separator className="my-4" />

              <InfoRow 
                icon={Fuel}
                label={t('contracts.viewModal.fuelLevelAtPickup')} 
                value={contract.petrol_at_take ? `${contract.petrol_at_take}%` : "-"} 
              />
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('contracts.viewModal.paymentInfo')}</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow 
                  label={t('contracts.viewModal.dailyPrice')} 
                  value={`AED ${formatCurrency(contract.daily_price)}`} 
                />
                <InfoRow 
                  label={t('contracts.viewModal.insuranceAmount')} 
                  value={`AED ${formatCurrency(contract.insurance_amount)}`} 
                />
              </div>

              <Separator className="my-4" />

              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">{t('contracts.viewModal.totalAmount')}</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                      AED {formatCurrency(contract.total_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">{t('contracts.viewModal.paidAmount')}</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                      AED {formatCurrency(contract.paid_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">{t('contracts.viewModal.remaining')}</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                      AED {formatCurrency((contract.total_amount || 0) - (contract.paid_amount || 0))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {attachments.length > 0 && (
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <Label className="text-lg font-semibold">{t('contracts.viewModal.attachments')}</Label>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {attachments.length} file(s)
                  </span>
                </div>

                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{attachment.attachment_name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(attachment.attachment_url, '_blank')}
                        className="flex-shrink-0"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t('contracts.viewModal.download')}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {contract.notes && (
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <Label className="text-lg font-semibold">{t('contracts.viewModal.notes')}</Label>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contract.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </CustomModalBody>

      <CustomModalFooter>
        <Button variant="outline" onClick={onClose}>
          {t('contracts.viewModal.close')}
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
