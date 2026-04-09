"use client"

import React from "react"
import InvoiceStatistics from "./invoices"
import PaymentStatistics from "./Payments"

function StatisticsPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <InvoiceStatistics />
      <PaymentStatistics />
    </div>
  )
}

export default StatisticsPage