import { Users } from "lucide-react";

export default function PageHeader({ title, description, icon: Icon = Users }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-3 bg-blue-100 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm ">{description}</p>
      </div>
    </div>
  );
}
