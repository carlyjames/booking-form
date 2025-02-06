"use client"
import Image from "next/image";
import { MapPin, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedLocation: "",
    weight: "",
    weightUnit: "",
    deliveryAddress: "",
    cargoType: "",
    pickupType: "",
  });
  const [countries, setCountries] = useState([]);
  const [suggestedCountries, setSuggestedCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        const sortedCountries = data.map(country => country.name.common).sort((a, b) => a.localeCompare(b));
        setCountries(sortedCountries);
        setSuggestedCountries(sortedCountries.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <section className="w-full flex flex-col items-start bg-white lg:w-[60%] p-8">
      <div className="w-full flex gap-4 items-center justify-around mb-12">
        {["Shipment Address & Details", "Delivery Address", "Confirmation"].map((label, index) => (
          <div key={index} onClick={() => setStep(index + 1)} className={`flex items-center gap-1 font-medium cursor-pointer ${step === index + 1 ? 'text-[#382869]' : 'text-gray-500'}`}>
            <div className={`h-6 w-6 text-white flex items-center justify-center rounded-full ${step === index + 1 ? 'bg-[#382869]' : 'bg-gray-500'}`}>{index + 1}</div>
            {label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="w-full flex flex-col gap-3 mb-12">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border border-gray-500 flex items-center justify-between p-2 gap-2 text-black">
              <input type="text" placeholder="Select a country" value={formData.selectedLocation} readOnly />
              <MapPin className="text-gray-500 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <DropdownMenuItem key={country} onClick={() => updateFormData("selectedLocation", country)}>{country}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

            {/* cargo type */}
          <Select onValueChange={(value) => updateFormData("cargoType", value)}>
            <SelectTrigger className="w-full border-gray-500 rounded-none">
              <SelectValue placeholder="Cargo Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full flex items-center gap-2">
            <input type="number" placeholder="Weight" className="border border-gray-500 p-2" value={formData.weight} onChange={(e) => updateFormData("weight", e.target.value)} />
            <Select onValueChange={(value) => updateFormData("weightUnit", value)}>
              <SelectTrigger className="border-gray-500 rounded-none px-2 py-1">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                <SelectItem value="lb">Pound (lb)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button onClick={nextStep} className="bg-[#382869] text-white p-2 w-full mt-4">Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full">
          <input type="text" placeholder="Delivery Address" className="border border-gray-500 p-2 w-full" value={formData.deliveryAddress} onChange={(e) => updateFormData("deliveryAddress", e.target.value)} />
          <Select onValueChange={(value) => updateFormData("pickupType", value)}>
            <SelectTrigger className="w-full border-gray-500 rounded-none mt-3">
              <SelectValue placeholder="Pickup Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local Delivery</SelectItem>
              <SelectItem value="international">International Shipping</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 text-white p-2">Previous</button>
            <button onClick={nextStep} className="bg-[#382869] text-white p-2">Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-4">Review Your Information</h2>
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="mb-2">
              <p className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="font-medium">{value || "----"}</p>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 text-white p-2">Previous</button>
            <button className="bg-[#382869] text-white p-2">Submit</button>
          </div>
        </div>
      )}
    </section>
  );
}
