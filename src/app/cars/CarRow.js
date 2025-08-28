import React from 'react';
import {
  Info,
  CalendarPlus,
  Pencil,
  Trash2,
  MoreHorizontal,
  FileSearch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import DeleteCarDialog from "./DeleteCarDialog";
import { useTranslations } from '@/hooks/useTranslations';

export default function CarRow({
  car,
  router,
  statusIcons,
  statusColors,
  statusLabels,
  categoryLabels,
}) {
  const tCars = useTranslations('cars');
  
  const bookingDisabledReason = (status) => {
    switch (status) {
      case 'rented':
        return tCars('menu.bookingDisabled.rented');
      case 'maintenance':
        return tCars('menu.bookingDisabled.maintenance');
      case 'unavailable':
        return tCars('menu.bookingDisabled.unavailable');
      default:
        return '';
    }
  };

  const StatusIcon = statusIcons[car.status];
  return (
    <tr className="border-b ">
      <td className="px-4 py-3">{car.make}</td>
      <td className="px-4 py-3">{car.model}</td>
      <td className="px-4 py-3">{car.year}</td>
      <td className="px-4 py-3">{car.color}</td>
      <td className="px-4 py-3">{car.plateNumber}</td>
      <td className="px-4 py-3">{tCars(`categories.${car.category}`) || car.category}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[car.status]}`}>
          <StatusIcon className="w-4 h-4" />
          {tCars(car.status)}
        </span>
      </td>
      <td className="px-4 py-3 font-semibold ">{car.dailyRate} درهم</td>
      <td className="px-4 py-3">
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/cars/detailes?car_id${car.id}`)}>
              <Info className="ml-2 w-4 h-4 text-gray-500" />
              {tCars('viewDetails')}
            </DropdownMenuItem>
        
            {car.status !== 'available' ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DropdownMenuItem
                      disabled
                      className="cursor-not-allowed opacity-60"
                    >
                      <CalendarPlus className="ml-2 w-4 h-4 text-gray-500" />
                      {tCars('bookCar')}
                    </DropdownMenuItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {bookingDisabledReason(car.status)}
                </TooltipContent>
              </Tooltip>
              
            ) : (
              <DropdownMenuItem
                onClick={() => router.push(`/contracts/add?car_id=${car.id}`)}
              >
                <CalendarPlus className="ml-2 w-4 h-4 " />
                {tCars('menu.newContract')}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => router.push(`/cars/fines?car_id=${car.id}`)}>
              <FileSearch className="ml-2 w-4 h-4 " />
              {tCars('menu.trafficFines')}
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => router.push(`/cars/edit/${car.id}`)}>
              <Pencil className="ml-2 w-4 h-4 text-gray-500" />
              تعديل
            </DropdownMenuItem> */}
            <DeleteCarDialog
              // onConfirm={() => router.push(`/cars/delete/${car.id}`)}
              trigger={({ open, setOpen }) => (
                <div>
                  <DropdownMenuItem
                    onSelect={e => {
                      e.preventDefault();
                      setOpen(true);
                    }}
                  >
                    <Trash2 className="ml-2 w-4 h-4 text-red-500" />
                    {tCars('menu.delete')}
                  </DropdownMenuItem>
                </div>
              )}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}