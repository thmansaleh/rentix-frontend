"use client"

import { Check, ChevronsUpDown } from "lucide-react"

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

const carsData = [
  {
    "id": "CAR001",
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "color": "أبيض",
    "plateNumber": "A-12345",
    "category": "sedan",
    "dailyRate": 200,
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
    "dailyRate": 400,

  },
  {
    "id": "CAR003",
    "make": "Mercedes",
    "model": "C-Class",
    "year": 2023,
    "color": "فضي",
    "plateNumber": "C-54321",
    "category": "luxury",
    "dailyRate": 350,
  },
]

export default function SelectCar() {
  const [open, setOpen] = useState(false)
  const [carId, setCarId] = useState("")
  const t = useTranslations()

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
          {carId
            ? carsData.find((car) => car.id === carId)?.make + " " + carsData.find((car) => car.id === carId)?.model
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
                  onSelect={() => {
                      setCarId(carId === car.id ? "" : car.id)
                      setOpen(false)
                    }}
                    >
                  {car.make} {car.model} - {car.plateNumber}
                  <Check
                    className={cn(
                        "ml-auto",
                        carId === car.id ? "opacity-100" : "opacity-0"
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
