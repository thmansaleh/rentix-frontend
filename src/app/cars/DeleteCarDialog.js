import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";

export default function DeleteCarDialog({ trigger, onConfirm }) {
  const [open, setOpen] = React.useState(false);
  const tCars = useTranslations('cars');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger({ open, setOpen })}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center'>{tCars('delete.title')}</DialogTitle>
          <DialogDescription>
            {tCars('delete.message')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {tCars('delete.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            {tCars('delete.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}