"use client"

import React from 'react'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Eye, Archive, Star } from "lucide-react"
import { useFormikContext } from '../FormikContext'
import CounterCaseFileInput from './CounterCaseFileInput'
import RelatedCasesDialog from './RelatedCasesDialog'

function Bar() {
  const { values, setFieldValue } = useFormikContext()
  const { 
    is_secret,
    is_archived,
    is_important
  } = values
  
  const { t } = useTranslations()
  const { language } = useLanguage()

  const toggleItems = [
    {
      id: 'secret',
      label: t('caseToggles.isSecret'),
      value: is_secret,
      onChange: (value) => setFieldValue('is_secret', value),
      icon: Eye,
      activeColor: 'bg-red-500 text-white',
      inactiveColor: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    },
    {
      id: 'archived',
      label: t('caseToggles.isArchived'),
      value: is_archived,
      onChange: (value) => setFieldValue('is_archived', value),
      icon: Archive,
      activeColor: 'bg-blue-500 text-white',
      inactiveColor: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    },
    {
      id: 'important',
      label: t('caseToggles.isImportant'),
      value: is_important,
      onChange: (value) => setFieldValue('is_important', value),
      icon: Star,
      activeColor: 'bg-yellow-500 text-white',
      inactiveColor: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    }
  ]

  return (
    <div className="space-y-6 flex  flex-wrap gap-4">
      {/* Case Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('caseSettings.title')}
        </h3>
        <div className="flex items-center- flex-wrap gap-3">
          {toggleItems.map((item) => {
            const IconComponent = item.icon
            return (
              <button
                type='button'
                key={item.id}
                onClick={() => item.onChange(!item.value)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 
                  ${item.value ? item.activeColor : item.inactiveColor}
                `}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
                <RelatedCasesDialog />

        </div>
      </div>

      {/* <RelatedCasesDialog /> */}
      <CounterCaseFileInput />
    </div>
  )
}

export default Bar