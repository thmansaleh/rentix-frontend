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

import { useLanguage } from "@/contexts/LanguageContext"
import { setClientData, setUserData } from "../../../redux/slices/addContractSlice"

// Example clients data, replace with real data source as needed
const clients = [
  { 
    id: 1, 
    name_ar: "محمد أحمد", 
    name_en: "Mohamed Ahmed", 
    phone: "+971 555 123 456",
    email: "mohamed.ahmed@email.com",
    nationality: "UAE",
    license_number: "LIC123456",
    address: "Dubai, UAE"
  },
  { 
    id: 2, 
    name_ar: "سارة علي", 
    name_en: "Sarah Ali", 
    phone: "+971 555 987 654",
    email: "sarah.ali@email.com",
    nationality: "Saudi Arabia",
    license_number: "LIC789012",
    address: "Abu Dhabi, UAE"
  },
  { 
    id: 3, 
    name_ar: "خالد العتيبي", 
    name_en: "Khaled Alotaibi", 
    phone: "+971 555 456 789",
    email: "khaled.alotaibi@email.com",
    nationality: "Kuwait",
    license_number: "LIC345678",
    address: "Sharjah, UAE"
  },
  { 
    id: 4, 
    name_ar: "أمل الزهراني", 
    name_en: "Amal Alzahrani", 
    phone: "+971 555 234 567",
    email: "amal.alzahrani@email.com",
    nationality: "Oman",
    license_number: "LIC901234",
    address: "Ajman, UAE"
  },
  { 
    id: 5, 
    name_ar: "عبدالله الحربي", 
    name_en: "Abdullah Alharbi", 
    phone: "+971 555 345 678",
    email: "abdullah.alharbi@email.com",
    nationality: "Bahrain",
    license_number: "LIC567890",
    address: "Fujairah, UAE"
  },
]




export default function SelectClient() {
  const dispatch = useDispatch()
  const contractData = useSelector((state) => state.addContract)
  const { clientData } = contractData
  
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()

 
  const handleClientSelect = (client) => {
    if (clientData?.id === client.id) {
      // Deselect if same client is clicked
      dispatch(setClientData(null))
    } else {
      // Select new client and store full object
      dispatch(setClientData(client))
    }
    setOpen(false)
  }


  return (
    <div>
      <Label className="mb-2 block">{language === "ar" ? "اختيار عميل" : "Select Client"}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {clientData
              ? `${language === "ar" ? clientData.name_ar : clientData.name_en}`
              : language === "ar" ? "اختر عميل..." : "Select client..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={language === "ar" ? "ابحث عن عميل..." : "Search client..."} className="h-9" />
            <CommandList>
              <CommandEmpty>{language === "ar" ? "لم يتم العثور على عميل." : "No client found."}</CommandEmpty>
              <CommandGroup>
                {clients.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={`${client.name_ar} ${client.name_en} ${client.phone}`}
                    onSelect={() => handleClientSelect(client)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {language === "ar" ? client.name_ar : client.name_en}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {client.phone}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        clientData?.id === client.id ? "opacity-100" : "opacity-0"
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
  );
}
