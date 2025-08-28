"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ban, CheckCircle, Mail, Phone, Calendar, AlertTriangle } from "lucide-react";

export default function ClientHeaderCard({ client, getInitials, formatDate }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={client.avatar} />
            <AvatarFallback className="text-lg">
              {getInitials(client.name_en)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{client.name_ar}</h2>
              <h3 className="text-lg- dark:text-white text-gray-600">{client.name_en}</h3>
              <Badge 
                variant={client.blacklisted ? "destructive bg-green-500" : "default"}
                className="flex items-center  bg-green-700 gap-1"
              >
                {client.blacklisted ? (
                  <>
                    <Ban className="w-3 h-3" />
                    محظور
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 " />
                    نشط
                  </>
                )}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 dark:text-white text-gray-500" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 dark:text-white text-gray-500" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 dark:text-white text-gray-500" />
                <span>عضو منذ: {formatDate(client.registration_date)}</span>
              </div>
            </div>
          </div>
          <div className="text-left">
            <Badge variant="secondary" className="mb-2">
              {client.membership_level}
            </Badge>
            <p className="text-sm dark:text-white text-gray-600">مستوى العضوية</p>
          </div>
        </div>

        {client.blacklisted && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>العميل محظور:</strong> {client.blacklist_reason}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
