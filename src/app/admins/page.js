'use client';
import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Search, Plus, User, MoreHorizontal, ChevronUp, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminTableRow from './AdminTableRow';
import AddAdminDialog from './AddAdminDialog';
import PageHeader from '@/components/PageHeader';
import { useTranslations } from '@/hooks/useTranslations';

// Fetcher function for SWR
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch admins data');
  }
  return response.json();
};

export default function AdminTablePage() {
  const t = useTranslations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use SWR for data fetching
  const { data: admins, error, isLoading, mutate } = useSWR('/api/admins.json', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000
  });

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!admins) return [];
    
    let filtered = admins.filter(admin => {
      const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.department.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
      const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [admins, searchTerm, statusFilter, roleFilter, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const StatusBadge = ({ status }) => {
    const isActive = status === 'نشط' || status === 'Active'; // Support both languages
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="" >
      <div className="">
        {/* Header */}
        <PageHeader 
          title={t('admins.title')}
          description={t('admins.description')}
        />

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>{t('admins.loadingData')}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center text-red-600">
              <p>{t('admins.errorLoading')}: {error.message}</p>
              <Button 
                onClick={() => mutate()} 
                className="mt-2"
                variant="outline"
              >
                {t('admins.retry')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search - Only show when not loading */}
        {!isLoading && !error && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={t('admins.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2"
                  />
                </div>

                {/* Status Filter */}
                <Select dir="rtl" value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="">
                    <SelectValue placeholder={t('admins.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">{t('admins.allStatuses')}</SelectItem>
                    <SelectItem value="نشط" className="cursor-pointer">{t('admins.active')}</SelectItem>
                    <SelectItem value="غير نشط" className="cursor-pointer">{t('admins.inactive')}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Role Filter */}
                <Select dir="rtl" value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="">
                    <SelectValue placeholder={t('admins.allRoles')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">{t('admins.allRoles')}</SelectItem>
                    <SelectItem value="مدير عام" className="cursor-pointer">{t('admins.generalManager')}</SelectItem>
                    <SelectItem value="مدير فرعي" className="cursor-pointer">{t('admins.subManager')}</SelectItem>
                    <SelectItem value="مشرف" className="cursor-pointer">{t('admins.supervisor')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add Button */}
              <AddAdminDialog onAdd={(newAdmin) => {
                // You can handle adding the new admin here (e.g., update state or send to backend)
                console.log("New admin:", newAdmin);
                // Optionally revalidate the SWR data
                mutate();
              }} />
            </div>
          </div>
        )}

        {/* Table - Only show when not loading */}
        {!isLoading && !error && (
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/80"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1 cursor-pointer">
                        {t('admins.name')}
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('admins.email')}
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/80"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center gap-1 cursor-pointer">
                        {t('admins.role')}
                        <SortIcon column="role" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/80"
                      onClick={() => handleSort('department')}
                    >
                      <div className="flex items-center gap-1 cursor-pointer">
                        {t('admins.department')}
                        <SortIcon column="department" />
                      </div>
                    </th> 
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('admins.status')}
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/80"
                      onClick={() => handleSort('lastLogin')}
                    >
                      <div className="flex items-center gap-1 cursor-pointer">
                        {t('admins.lastLogin')}
                        <SortIcon column="lastLogin" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('admins.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredAndSortedData.map((admin) => (
                    <AdminTableRow key={admin.id} admin={admin} StatusBadge={StatusBadge} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAndSortedData.length === 0 && (
          <div className=" rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admins.noResults')}</h3>
            <p className="text-gray-500">{t('admins.noResultsDescription')}</p>
          </div>
        )}
      </div>
    </div>
  );
}