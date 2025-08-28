'use client'
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { useSelector } from "react-redux";

export default function SubmitButton() {
  const t = useTranslations();
  const editCar = useSelector(state => state.editCar || {});

  return (
    <div className="flex justify-center pt-4">
      <Button
        onClick={() => {
          console.log('Submitting car data:', editCar);
        }}
      >
        save
      </Button>
    </div>
  );
}


