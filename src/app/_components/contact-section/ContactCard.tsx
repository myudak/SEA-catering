import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, MapPin } from "lucide-react";
import { AnimatedModalDemo } from "./AnimatedButton";

interface ContactCardProps {
  manager: string;
  phone: string;
}

export function ContactCard({ manager, phone }: ContactCardProps) {
  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-semibold">
          Contact Details
        </CardTitle>
        <CardDescription className="text-center text-base">
          Reach out directly or request a callback — we&apos;re just one message
          away.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Manager Info */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
          <div className="p-3 bg-emerald-100 rounded-full">
            <MapPin className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-medium">Manager</p>
            <p className="text-muted-foreground">{manager}</p>
          </div>
        </div>

        {/* Phone Info */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
          <div className="p-3 bg-blue-100 rounded-full">
            <Phone className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-medium">Phone</p>
            <p className="text-muted-foreground text-lg">{phone}</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-4">
          <AnimatedModalDemo />
        </div>
      </CardContent>
    </Card>
  );
}
