"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";

const dummyAddresses = [
  { id: "1", fullName: "John Doe", street: "123 Main St", city: "Kampala", country: "Uganda", phone: "+256 712 345 678", isDefault: true },
];

export default function AddressesPage() {
  const { data: session } = useSession();
  const [addresses] = useState(dummyAddresses);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">My Addresses</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2" size="sm">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {showForm && (
        <Card className="border-sage-100">
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+256 712 345 678" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Kampala" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" defaultValue="Uganda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" placeholder="00100" />
              </div>
            </div>
            <Button>Save Address</Button>
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 ? (
        <Card className="border-sage-100">
          <CardContent className="py-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-neutral-300" />
            <p className="mt-4 text-neutral-500">No saved addresses.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id} className={`border-sage-100 ${addr.isDefault ? "ring-2 ring-sage-500" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-neutral-900">{addr.fullName}</p>
                    <p className="text-neutral-500">{addr.street}</p>
                    <p className="text-neutral-500">{addr.city}, {addr.country}</p>
                    <p className="text-neutral-500">{addr.phone}</p>
                  </div>
                  <button className="text-neutral-400 hover:text-error-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {addr.isDefault && (
                  <p className="mt-3 text-xs font-medium text-sage-600">Default</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
