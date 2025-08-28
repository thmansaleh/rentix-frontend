import React, { useState } from 'react';
import { X, Check, Star, Heart, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Modal() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div >
      {/* Trigger Button */}
     
    

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeModal}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl animate-in zoom-in-95 fade-in duration-300">
            {/* Glass Effect Background */}
            <div className="absolute inset-0 bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border" />
            
            {/* Modal Content */}
            <div className="relative bg-card backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-8 py-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Premium Features</h2>
                      <p className="text-muted-foreground text-sm">Unlock amazing possibilities</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-muted/50 hover:bg-muted rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90 group"
                  >
                    <X className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mt-6 bg-muted/20 rounded-xl p-1">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'features', label: 'Features' },
                    { id: 'pricing', label: 'Pricing' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body */}
           

            </div>
          </div>
        </div>
      )}
    </div>
  );
}