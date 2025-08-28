'use client';
import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTranslations } from '@/hooks/useTranslations';
import FineRow from './FineRow';
import AddFineDialog from './AddFineDialog';
import FinesStats from './FinesStats';

const mockFines = [
	{
		id: 'FINE001',
		carPlate: 'A-12345',
		amount: 500,
		date: '2025-07-10',
		reason: 'تجاوز السرعة',
		status: 'unpaid',
		emirate: 'دبي',
		source: 'شرطة دبي',
	},
	{
		id: 'FINE002',
		carPlate: 'B-67890',
		amount: 150,
		date: '2025-06-22',
		reason: 'وقوف خاطئ',
		status: 'paid',
		emirate: 'عجمان',
		source: 'بلدية عجمان',
	},
	{
		id: 'FINE003',
		carPlate: 'C-54321',
		amount: 200,
		date: '2025-05-15',
		reason: 'عدم ربط الحزام',
		status: 'unpaid',
		emirate: 'دبي',
		source: 'سالك',
	},
];

const statusLabels = {
	paid: 'مدفوع',
	unpaid: 'غير مدفوع',
};

const statusColors = {
	paid: 'bg-green-100 text-green-800 border-green-200',
	unpaid: 'bg-red-100 text-red-800 border-red-200',
};

export default function FinesPage() {
	const t = useTranslations();
	const [fines, setFines] = useState(mockFines);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [carFilter, setCarFilter] = useState('all');
	const [addOpen, setAddOpen] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	const carOptions = Array.from(new Set(fines.map(f => f.carPlate)));

	React.useEffect(() => {
		const plateNo = searchParams.get('plate_no');
		if (plateNo && carOptions.includes(plateNo)) {
			setCarFilter(plateNo);
		}
	}, [searchParams, carOptions]);

	const filteredFines = fines.filter((fine) => {
		const matchesSearch =
			fine.carPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
			fine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			fine.reason.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;
		const matchesCar = carFilter === 'all' || fine.carPlate === carFilter;

		return matchesSearch && matchesStatus && matchesCar;
	});

	const handleAddFine = (newFine) => {
		setFines((prev) => [...prev, { ...newFine, id: `FINE${prev.length + 1}` }]);
	};

	return (
		<TooltipProvider>
			<div className="  p-4 md:p-6">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<Card className="mb-6">
						<CardContent className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
							<div>
								<h1 className="text-2xl font-bold ">{t('fines.title')}</h1>
								<p className=" mt-0.5 text-sm">{t('fines.description')}</p>
							</div>
							<Button
								onClick={() => setAddOpen(true)}
								className="flex items-center gap-2   py-2 px-3 text-sm"
							>
								<Plus size={18} />
								{t('fines.addNew')}
							</Button>
							<AddFineDialog
								open={addOpen}
								onOpenChange={setAddOpen}
								onAdd={handleAddFine}
							/>
						</CardContent>
					</Card>
					{/* Stats */}
					<FinesStats fines={fines} />
					{/* Filters */}
					<Card className="mb-6">
						<CardContent className="p-6 flex flex-col md:flex-row gap-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
								<Input
									type="text"
									placeholder={t('fines.searchPlaceholder')}
									className="w-full pl-10 pr-4 py-2"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
							<div className="flex items-center gap-2">
								<Filter className="" size={20} />
								<Select className='cursor-pointer' dir="rtl" value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-36">
										<SelectValue dir="rtl" placeholder="كل الحالات" />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem  value="all">{t('fines.filters.allStatuses')}</SelectItem>
										<SelectItem value="paid">{t('fines.status.paid')}</SelectItem>
										<SelectItem value="unpaid">{t('fines.status.unpaid')}</SelectItem>
									</SelectContent>
								</Select>
								{/* Car filter */}
								<Select dir="rtl" value={carFilter} onValueChange={setCarFilter}>
									<SelectTrigger className="w-36">
										<SelectValue placeholder="كل السيارات" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">{t('fines.filters.allCars')}</SelectItem>
										{carOptions.map(car => (
											<SelectItem key={car} value={car}>{car}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* Fines List */}
					<Card>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm text-right">
									<thead className="bg-gray-50 border-b">
										<tr>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.fineNumber')}</th>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.plateNumber')}</th>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.amount')}</th>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.date')}</th>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.reason')}</th>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.emirate')}</th>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.source')}</th>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.status')}</th>
											<th className="px-4 py-3 font-semibold text-gray-700">{t('fines.table.actions')}</th>
										</tr>
									</thead>
									<tbody>
										{filteredFines.length > 0 ? (
											filteredFines.map((fine) => <FineRow key={fine.id} fine={fine} />)
										) : (
											<tr>
												<td colSpan={9} className="text-center py-8 text-gray-500">
													{t('fines.noResults')}
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</TooltipProvider>
	);
}