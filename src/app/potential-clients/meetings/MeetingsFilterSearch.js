"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export function MeetingsFilterSearch({ onSearch }) {
  const { t } = useTranslations();
  
  // Local state - doesn't trigger API calls
  const [searchTerm, setSearchTerm] = useState("");
  const [meetResult, setMeetResult] = useState("all");
  const [meetingType, setMeetingType] = useState("all");
  const [date, setDate] = useState("");

  // Handle search button click - this triggers the API call
  const handleSearchClick = () => {
    onSearch({
      searchTerm,
      meet_result: meetResult,
      meeting_type: meetingType,
      date
    });
  };

  // Handle reset filters
  const handleReset = () => {
    setSearchTerm("");
    setMeetResult("all");
    setMeetingType("all");
    setDate("");
    onSearch({
      searchTerm: "",
      meet_result: "all",
      meeting_type: "all",
      date: ""
    });
  };

  // Allow search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("meetings.search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={meetResult} onValueChange={setMeetResult}>
          <SelectTrigger>
            <SelectValue placeholder={t("meetings.filters.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("meetings.filters.allStatuses")}</SelectItem>
            <SelectItem value="scheduled">{t("meetings.results.scheduled")}</SelectItem>
            <SelectItem value="completed">{t("meetings.results.completed")}</SelectItem>
            <SelectItem value="cancelled">{t("meetings.results.cancelled")}</SelectItem>
            <SelectItem value="rescheduled">{t("meetings.results.rescheduled")}</SelectItem>
            <SelectItem value="no_show">{t("meetings.results.noShow")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Meeting Type Filter */}
        <Select value={meetingType} onValueChange={setMeetingType}>
          <SelectTrigger>
            <SelectValue placeholder={t("meetings.filters.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("meetings.filters.allTypes")}</SelectItem>
            <SelectItem value="online">{t("meetings.types.online")}</SelectItem>
            <SelectItem value="onsite">{t("meetings.types.onsite")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder={t("meetings.filters.selectDate")}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleSearchClick} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          {t("meetings.actions.search") || "Search"}
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {t("meetings.actions.reset") || "Reset"}
        </Button>
      </div>
    </div>
  );
}
