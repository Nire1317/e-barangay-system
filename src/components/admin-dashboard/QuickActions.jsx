import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../ui/card.component";

import { useNavigate } from "react-router-dom";

export default function QuickActions({ actions }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Actions</CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Frequently used administrative functions
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                onClick={() => navigate(action.path)}
                className="h-auto py-4 flex flex-col gap-2 hover:scale-105 transition-transform"
              >
                <Icon />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
