"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useTranslations } from "@/hooks/useTranslations"
import { setVehicleData } from "../../../redux/slices/addContractSlice"

const carsData = [
  {
    "id": "CAR001",
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "color": "أبيض",
    "plateNumber": "A-12345",
    "category": "sedan",
    "fuelType": "بنزين",
    "transmission": "أوتوماتيك",
    "seatingCapacity": 5,
    "status": "available",
    "pricePerDay": 200,
    "features": ["تكييف", "نظام ملاحة", "كاميرا خلفية"]
  },
  {
    "id": "CAR002",
    "make": "BMW",
    "model": "X5",
    "year": 2024,
    "color": "أسود",
    "plateNumber": "B-67890",
    "category": "suv",
    "fuelType": "بنزين",
    "transmission": "أوتوماتيك",
    "seatingCapacity": 7,
    "status": "available",
    "pricePerDay": 400,
    "features": ["دفع رباعي", "فتحة سقف", "مقاعد جلدية", "نظام صوتي متقدم"]
  },
  {
    "id": "CAR003",
    "make": "Mercedes",
    "model": "C-Class",
    "year": 2023,
    "color": "فضي",
    "plateNumber": "C-54321",
    "category": "luxury",
    "fuelType": "بنزين",
    "transmission": "أوتوماتيك",
    "seatingCapacity": 5,
    "status": "available",
    "pricePerDay": 350,
    "features": ["مقاعد جلدية", "نظام ملاحة", "تحكم بالمناخ", "كاميرا 360"]
  },
]

export default function SelectCar() {
  const dispatch = useDispatch()
  const contractData = useSelector((state) => state.addContract)
  const { vehicleData } = contractData
  
  const [open, setOpen] = useState(false)
  const t = useTranslations()

  const handleCarSelect = (car) => {
    if (vehicleData?.id === car.id) {
      // Deselect if same car is clicked
      dispatch(setVehicleData(null))
    } else {
      // Select new car and store full object
      dispatch(setVehicleData(car))
    }
    setOpen(false)
  }

  return <div >
            <Label className="mb-2 block">{t('contracts.addForm.vehicle.title')}</Label>

   <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          >
          {vehicleData
            ? `${vehicleData.make} ${vehicleData.model}`
            : t('contracts.addForm.vehicle.title') + "..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t('contracts.addForm.vehicle.searchPlaceholder')} className="h-9" />
          <CommandList>
            <CommandEmpty>{t('contracts.addForm.vehicle.noResults')}</CommandEmpty>
            <CommandGroup>
              {carsData.map((car) => (
                  <CommandItem
                  key={car.id}
                  value={`${car.make} ${car.model} ${car.plateNumber} ${car.color}`}
                  onSelect={() => handleCarSelect(car)}
                    >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {car.make} {car.model} - {car.plateNumber}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {car.year} • {car.color} • {car.pricePerDay} {t('common.currency')}/يوم
                    </span>
                  </div>
                  <Check
                    className={cn(
                        "ml-auto",
                        vehicleData?.id === car.id ? "opacity-100" : "opacity-0"
                    )}
                    />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    

                    </div>
  
}
