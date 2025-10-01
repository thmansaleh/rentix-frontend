"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash } from "lucide-react";
import { removePartyFromCase } from "@/app/services/api/parties";
import { toast } from "react-toastify";
import { useTranslations } from "@/hooks/useTranslations";

const DeletePartyModal = ({ 
  children, 
  caseId, 
  party, 
  onPartyDeleted 
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslations();

  const handleDelete = async () => {
    if (!caseId || !party) return;

    try {
      setLoading(true);
      
      // Call the API to remove party from case
      const response = await removePartyFromCase(caseId, party.case_party_id);
      
      if (response.success) {
        toast.success(t('parties.partyRemovedSuccess') || 'Party removed from case successfully');
        
        // Call the onPartyDeleted callback if provided
        if (onPartyDeleted) {
          onPartyDeleted();
        }
        
        setOpen(false);
      } else {
        toast.error(t('parties.errorRemovingParty') || 'Error occurred while removing party from case');
      }
    } catch (error) {
      console.error('Error removing party from case:', error);
      toast.error(t('parties.errorRemovingParty') || 'Error occurred while removing party from case');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!loading) {
      setOpen(isOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t('parties.confirmDelete') || 'Confirm Deletion'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            {t('parties.deleteConfirmMessage') || 'Are you sure you want to remove this party from the case?'}
          </p>
          
          {party && (
            <div className="bg-muted/50 p-3 rounded-lg border">
              <p className="font-medium text-sm">
                {party.party_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('parties.partyType')}: {party.type === 'client' ? t('parties.client') : t('parties.opponent')}
              </p>
              {party.phone && (
                <p className="text-xs text-muted-foreground">
                  {t('parties.phone')}: {party.phone}
                </p>
              )}
            </div>
          )}
          
          <p className="text-sm text-muted-foreground mt-4">
            {t('parties.deleteWarning') || 'This action cannot be undone. The party will be removed from this case but will remain in the system for other cases.'}
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            {t('parties.cancel') || 'Cancel'}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('parties.removing') || 'Removing...'}
              </>
            ) : (
              <>
                <Trash className="h-4 w-4 mr-2" />
                {t('parties.removeFromCase') || 'Remove from Case'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePartyModal;