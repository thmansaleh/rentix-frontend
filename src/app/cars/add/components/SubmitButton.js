'use client'
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { useSelector } from "react-redux";

export default function SubmitButton({ isSubmitting = false }) {
  const t = useTranslations();
    const addCar = useSelector(state => state.addCar || {})

  return (
    <div className="flex justify-center pt-4">
      <Button
        onClick={() => {
          console.log('Submitting car data:', addCar);
        }}
      >
        save
      </Button>
    </div>
  );
}


