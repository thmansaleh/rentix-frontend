import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

export function ClientHeader({ customer }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-primary/20 rounded-full">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {customer.full_name}
          </h3>
        </div>
      </div>
    </Card>
  );
}
