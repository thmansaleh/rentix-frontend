"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, Edit } from "lucide-react";
import AddPartyToTableModal from "./components/AddPartyToTableModal";
import EditPartyModal from "./components/EditPartyModal";
import { useParties } from "./hooks/useParties";
import { useTranslations } from "@/hooks/useTranslations";
import { useFormikContext } from '../FormikContext';

function Parties() {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const selectedParties = values.selectedParties || [];
  const { t } = useTranslations();

  // Use custom hook for parties data
  const { mutate } = useParties(1);

  const handleRemoveParty = (partyId) => {
    const updatedParties = selectedParties.filter(party => party.id !== partyId);
    setFieldValue('selectedParties', updatedParties);
    // Also update the parties array for backward compatibility
    setFieldValue('parties', updatedParties);
  };

  const getPartyTypeBadge = (partyType) => {
    return partyType === 'client' ? (
      <Badge variant="default" className="bg-green-100 text-green-800">{t('parties.client')}</Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">{t('parties.opponent')}</Badge>
    );
  };

  return (
    <Card className={errors.selectedParties && touched.selectedParties ? 'border-red-500' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {t('parties.title')} <span className="text-red-500">*</span>
          </span>
          <AddPartyToTableModal 
            selectedParties={selectedParties}
          >
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 ml-2" />
              {t('parties.addToCase')}
            </Button>
          </AddPartyToTableModal>
        </CardTitle>
        {errors.selectedParties && touched.selectedParties && (
          <div className="text-red-500 text-sm mt-2">{errors.selectedParties}</div>
        )}
      </CardHeader>
      <CardContent>
        {selectedParties.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="mb-4">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
            </div>
            <p className="mb-4">{t('parties.noPartiesAdded')}</p>
            <AddPartyToTableModal 
              selectedParties={selectedParties}
            >
              <Button variant="outline">
                <Plus className="h-4 w-4 ml-2" />
                {t('parties.addToCase')}
              </Button>
            </AddPartyToTableModal>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t('parties.partiesCount', { count: selectedParties.length })}
              </p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-center'>{t('parties.partyName')}</TableHead>
                  <TableHead className='text-center'>{t('parties.partyType')}</TableHead>
                  <TableHead className='text-center'>{t('parties.phone')}</TableHead>
                  <TableHead className='text-center'>{t('parties.email')}</TableHead>
                  <TableHead className='text-center'>{t('parties.category')}</TableHead>
                  <TableHead className='text-center'>{t('parties.files')}</TableHead>
                  <TableHead className="text-center">{t('parties.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedParties.map((party) => (
                  <TableRow key={party.id}>
                    <TableCell className="font-medium text-center" >{party.name}</TableCell>
                    <TableCell className='text-center'>{getPartyTypeBadge(party.type)}</TableCell>
                    <TableCell className='text-center'>{party.phone}</TableCell>
                    <TableCell className='text-center'>{party.email || t('parties.notSpecified')}</TableCell>
                    <TableCell className='text-center'>
                      {party.category === 'individual' ? t('parties.individual') : 
                       party.category === 'company' ? t('parties.company') : 
                       party.category === 'government' ? t('parties.government') : t('parties.notSpecified')}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge variant="outline">
                        {party.files?.length || 0} {t('parties.filesCount')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <EditPartyModal party={party}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </EditPartyModal>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParty(party.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
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
      </CardContent>
    </Card>
  );
}

export default Parties;