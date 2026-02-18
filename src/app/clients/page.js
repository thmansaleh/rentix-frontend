"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Users, Loader2, Search, Eye, Edit, Trash2, ShieldBan } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddClientModal } from './AddClientModal';
import { EditClientModal } from './EditClientModal';
import { DeleteClientModal } from './DeleteClientModal';
import { getCustomers } from '../services/api/customers';
import { toast } from 'react-toastify';
import { useTranslations } from '@/hooks/useTranslations';
import { useDebounce } from '@/hooks/useDebounce';

export default function ClientsPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers(searchQuery);
  }, [searchQuery]);

  const fetchCustomers = async (search = '') => {
    try {
      setIsLoading(true);
      const response = await getCustomers(search);
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error(t('clients.failedToLoadClients'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  const handleViewCustomer = (customerId) => {
    router.push(`/clients/${customerId}`);
  };

  const handleEditCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsEditModalOpen(true);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('clients.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('clients.subtitle')}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('clients.addNewClient')}
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t('clients.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {t('common.search')}
          </Button>
        </form>
      </Card>

      {/* Table Card */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? t('clients.noMatchingClients') : t('clients.noClientsFound')}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('clients.addFirstClient')}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('clients.table.name')}</TableHead>
                  <TableHead>{t('clients.table.phone')}</TableHead>
                  <TableHead>{t('clients.table.status')}</TableHead>
                  <TableHead>{t('clients.table.joinDate')}</TableHead>
                  <TableHead className="text-right">{t('clients.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.full_name}
                    </TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      {customer.is_blacklisted ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <ShieldBan className="w-3 h-3" />
                          {t('clients.blacklisted')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600 w-fit">
                          {t('clients.active')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(customer.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCustomer(customer.id)}
                          className="h-8 w-8 p-0"
                          title={t('clients.viewClient')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCustomer(customer.id)}
                          className="h-8 w-8 p-0"
                          title={t('clients.editClient')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer)}
                          className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title={t('clients.deleteClient')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Stats Footer */}
        {customers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{t('clients.totalClients')}: {customers.length}</span>
              {searchQuery && (
                <span className="text-primary">
                  {t('clients.showingResultsFor')}: "{searchQuery}"
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchCustomers(searchQuery)}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchCustomers(searchQuery)}
        customerId={selectedCustomerId}
      />

      {/* Delete Client Modal */}
      <DeleteClientModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => fetchCustomers(searchQuery)}
        customer={selectedCustomer}
      />
    </div>
  );
}