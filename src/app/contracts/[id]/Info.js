import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from '@/hooks/useTranslations';
import SelectCar from "./SelectCar";
import SelectClient from "./SelectClient";

const Info = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [days, setDays] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [weeklyRate, setWeeklyRate] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [mileageAtPickup, setMileageAtPickup] = useState("");
  const [fuelLevelAtPickup, setFuelLevelAtPickup] = useState("");
  const [dailyAllowedKilometers, setDailyAllowedKilometers] = useState("");
  const [discount, setDiscount] = useState("");
  const [insuranceDeposit, setInsuranceDeposit] = useState("");
  const [mileageAtReturn, setMileageAtReturn] = useState("");
  const [contractStatus, setContractStatus] = useState("new");

  const t = useTranslations('contracts.addForm.dates');
  const vehicleT = useTranslations('contracts.addForm.vehicle');
  const contractsT = useTranslations('contracts');
  const insuranceT = useTranslations('contracts.addForm.insurance');

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays.toString());
    } else if (startDate && days && !isNaN(Number(days))) {
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setDate(calculatedEndDate.getDate() + Number(days));
      setEndDate(calculatedEndDate);
    }
  }, [startDate, endDate, days]);

  const handleDaysChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) > 0 && Number(value) <= 365)) {
      setDays(value);
      if (startDate && value) {
        const calculatedEndDate = new Date(startDate);
        calculatedEndDate.setDate(calculatedEndDate.getDate() + Number(value));
        setEndDate(calculatedEndDate);
      }
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(undefined);
      setDays("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date < startDate) {
      setStartDate(undefined);
      setDays("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-600" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-6 mt-2">

          <SelectClient />



          <SelectCar />

          <div>
            <Label className="mb-2 block">{t('startDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "yyyy-MM-dd") : t('selectStartDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="mb-2 block">{t('numberOfDays')}</Label>
            <Input
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={handleDaysChange}
              placeholder={t('enterDays')}
            />
          </div>

          <div>
            <Label className="mb-2 block">{t('endDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "yyyy-MM-dd") : t('selectEndDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  disabled={(date) => startDate && date < startDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>


          <div>
            <Label className="mb-2 block">{t('pickupTime')}</Label>
            <Input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              placeholder="وقت الاستلام"
            />
          </div>

          <div>
            <Label className="mb-2 block">{t('returnTime')}</Label>
            <Input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              placeholder={t('returnTime')}
            />
          </div>

          <div>
            <Label className="mb-2 block">{vehicleT('dailyRateLabel')}</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              placeholder={vehicleT('enterDailyRate')}
            />
          </div>

          {/* <div>
            <Label className="mb-2 block">{vehicleT('weeklyRateLabel')}</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={weeklyRate}
              onChange={(e) => setWeeklyRate(e.target.value)}
              placeholder={vehicleT('enterWeeklyRate')}
            />
          </div> */}
          {/* 
          <div>
            <Label className="mb-2 block">{vehicleT('monthlyRateLabel')}</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={monthlyRate}
              onChange={(e) => setMonthlyRate(e.target.value)}
              placeholder={vehicleT('enterMonthlyRate')}
            />
          </div> */}

          <div>
            <Label className="mb-2 block">{vehicleT('mileageAtStart')}</Label>
            <Input
              type="number"
              min="0"
              value={mileageAtPickup}
              onChange={(e) => setMileageAtPickup(e.target.value)}
              placeholder={vehicleT('enterMileage')}
            />
          </div>



          <div>
            <Label className="mb-2 block">{vehicleT('dailyAllowedKilometers')}</Label>
            <Input
              type="number"
              min="0"
              value={dailyAllowedKilometers}
              onChange={(e) => setDailyAllowedKilometers(e.target.value)}
              placeholder={vehicleT('enterDailyAllowedKilometers')}
            />
          </div>


          <div>
            <Label className="mb-2 block">{vehicleT('mileageAtReturn')}</Label>
            <Input
              type="number"
              min="0"
              value={mileageAtReturn}
              onChange={(e) => setMileageAtReturn(e.target.value)}
              placeholder={vehicleT('enterMileageAtReturn')}
              disabled
            />
          </div>

          <div>
            <Label className="mb-2 block">{vehicleT('fuelLevelAtStart')}</Label>
            <Select value={fuelLevelAtPickup} onValueChange={setFuelLevelAtPickup}>
              <SelectTrigger>
                <SelectValue placeholder={vehicleT('selectLevel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% - {contractsT('emptyFuel')}</SelectItem>
                <SelectItem value="25">25% - {contractsT('quarterFuel')}</SelectItem>
                <SelectItem value="50">50% - {contractsT('halfFuel')}</SelectItem>
                <SelectItem value="75">75% - {contractsT('threeQuartersFuel')}</SelectItem>
                <SelectItem value="100">100% - {contractsT('fullFuel')}</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div>
            <Label className="mb-2 block">{vehicleT('discount')}</Label>
            <Input
            
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder={vehicleT('enterDiscount')}
            />
          </div>

          <div>
            <Label className="mb-2 block">{insuranceT('title')}</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={insuranceDeposit}
              onChange={(e) => setInsuranceDeposit(e.target.value)}
              placeholder={insuranceT('enterAmount')}
            />
          </div>

          <div>
            <Label className="mb-2 block">{contractsT('contractStatus')}</Label>
            <RadioGroup 
              value={contractStatus} 
              onValueChange={setContractStatus}
              className="flex  items-center gap-x-4 "
            >
              <div className="flex items-center gap-x-1">
                <Label className={'cursor-pointer'} htmlFor="new">{contractsT('new')}</Label>
                <RadioGroupItem value="new" id="new" />
              </div>
              <div className="flex items-center gap-x-1 ">
                <Label className={'cursor-pointer'} htmlFor="completed">{contractsT('completed')}</Label>
                <RadioGroupItem value="completed" id="completed" />
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Info;