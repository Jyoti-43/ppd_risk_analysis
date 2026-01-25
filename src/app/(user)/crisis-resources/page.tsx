"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Phone,
  Globe,
  Clock,
  ShieldAlert,
  Hospital,
  HeartHandshake,
  Stethoscope,
  Filter,
  Flower,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Types ---
type ResourceType =
  | "Hospital"
  | "Hotline"
  | "Counseling Center"
  | "Mental Health Clinic"
  | "Yoga Center";

interface CrisisResource {
  id: string;
  name: string;
  type: ResourceType;
  province: string;
  city: string;
  address: string;
  phone: string;
  hotline?: boolean; // If it's a 24/7 crisis line
  email?: string;
  website?: string;
  hours: string;
  description: string;
}

// --- Mock Data (Nepal Context) ---
const NEPAL_PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const MOCK_RESOURCES: CrisisResource[] = [
  {
    id: "1",
    name: "TPO Nepal (Transcultural Psychosocial Organization)",
    type: "Counseling Center",
    province: "Bagmati",
    city: "Kathmandu",
    address: "Baluwatar, Kathmandu",
    phone: "16600102005",
    hotline: true,
    website: "https://www.tponepal.org",
    hours: "24/7 Helpline",
    description:
      "One of Nepal's leading psychosocial organizations promoting psychosocial well-being and mental health.",
  },
  {
    id: "2",
    name: "Patan Mental Hospital",
    type: "Hospital",
    province: "Bagmati",
    city: "Lalitpur",
    address: "Lagankhel, Lalitpur",
    phone: "01-5521333",
    hotline: false,
    hours: "24/7 Emergency",
    description:
      "The dedicated mental health hospital in Nepal providing psychiatric and psychological services.",
  },
  {
    id: "3",
    name: "Koshish Nepal",
    type: "Mental Health Clinic",
    province: "Bagmati",
    city: "Kathmandu",
    address: "Kusunti, Kathmandu",
    phone: "16600122322",
    hotline: true,
    hours: "9:00 AM - 5:00 PM",
    description:
      "A national mental health self-help organization promoting mental health and psychosocial wellbeing.",
  },
  {
    id: "4",
    name: "CMC-Nepal (Centre for Mental Health and Counselling)",
    type: "Counseling Center",
    province: "Bagmati",
    city: "Kathmandu",
    address: "Thapathali, Kathmandu",
    phone: "01-4102037",
    hotline: false,
    website: "http://cmcnepal.org.np",
    hours: "10:00 AM - 5:00 PM",
    description:
      "Works in mental health and development, giving special attention to the needs of marginalized people.",
  },
  {
    id: "5",
    name: "Western Regional Hospital (Gandaki Hospital)",
    type: "Hospital",
    province: "Gandaki",
    city: "Pokhara",
    address: "Ramghat, Pokhara",
    phone: "061-520066",
    hours: "24/7 Emergency",
    description:
      "Major government hospital in Pokhara with a dedicated psychiatric department.",
  },
  {
    id: "6",
    name: "Lumbini Provincial Hospital",
    type: "Hospital",
    province: "Lumbini",
    city: "Butwal",
    address: "Butwal, Rupandehi",
    phone: "071-540304",
    hours: "24/7",
    description:
      "Provides mental health outpatient and inpatient services for the Lumbini province.",
  },
  {
    id: "7",
    name: "National Suicide Prevention Hotline",
    type: "Hotline",
    province: "Bagmati",
    city: "Kathmandu",
    address: "Lagankhel (Operated by Patan Hospital)",
    phone: "1166",
    hotline: true,
    hours: "24/7",
    description:
      "Government-operated toll-free suicide prevention and crisis support hotline.",
  },
  {
    id: "8",
    name: "Koshi Zonal Hospital",
    type: "Hospital",
    province: "Koshi",
    city: "Biratnagar",
    address: "Biratnagar, Morang",
    phone: "021-522144",
    hours: "24/7",
    description:
      "General hospital providing psychiatric care in Eastern Nepal.",
  },
  {
    id: "9",
    name: "Chitwan Medical College",
    type: "Mental Health Clinic",
    province: "Bagmati",
    city: "Bharatpur",
    address: "Bharatpur, Chitwan",
    phone: "056-532933",
    hours: "24/7 Emergency",
    description: "Teaching hospital with comprehensive mental health clinics.",
  },
  {
    id: "10",
    name: "Seti Provincial Hospital",
    type: "Hospital",
    province: "Sudurpashchim",
    city: "Dhangadhi",
    address: "Dhangadhi, Kailali",
    phone: "091-521271",
    hours: "24/7",
    description:
      "Key healthcare provider in the Far-West region offering mental health support.",
  },
  // --- YOGA CENTERS ---
  {
    id: "11",
    name: "Osho Tapoban",
    type: "Yoga Center",
    province: "Bagmati",
    city: "Kathmandu",
    address: "Nagarjun Hills, Kathmandu",
    phone: "01-4350312",
    hours: "6:00 AM - 8:00 PM",
    website: "https://tapoban.org",
    description:
      "A holistic spiritual retreat offering meditation and yoga programs in nature.",
  },
  {
    id: "12",
    name: "Pokhara Yoga School",
    type: "Yoga Center",
    province: "Gandaki",
    city: "Pokhara",
    address: "Lakeside, Pokhara",
    phone: "985-6021234",
    hours: "6:00 AM - 7:00 PM",
    website: "https://pokharayogaschool.com",
    description:
      "Offers comprehensive yoga teacher training and daily drop-in yoga classes.",
  },
  {
    id: "13",
    name: "Himalayan Yoga Academy",
    type: "Yoga Center",
    province: "Bagmati",
    city: "Kathmandu",
    address: "Baluwatar, Kathmandu",
    phone: "984-1234567",
    hours: "6:00 AM - 6:00 PM",
    description:
      "Traditional yoga and meditation center focusing on holistic healing.",
  },
  {
    id: "14",
    name: "Lumbini Buddha Garden Resort & Yoga",
    type: "Yoga Center",
    province: "Lumbini",
    city: "Lumbini",
    address: "Lumbini Sanskritik",
    phone: "071-580123",
    hours: "5:00 AM - 9:00 PM",
    description:
      "A peaceful environment for meditation and yoga near the birthplace of Buddha.",
  },
  {
    id: "15",
    name: "Patanjali Yoga Center",
    type: "Yoga Center",
    province: "Bagmati",
    city: "Lalitpur",
    address: "Satdobato, Lalitpur",
    phone: "01-5544332",
    hours: "5:00 AM - 7:00 PM",
    description:
      "Promoting health through Yoga and Ayurveda across the community.",
  },
  {
    id: "16",
    name: "Ananda Yoga Center",
    type: "Yoga Center",
    province: "Koshi",
    city: "Biratnagar",
    address: "Traffic Chowk, Biratnagar",
    phone: "981-2345678",
    hours: "6:00 AM - 6:00 PM",
    description:
      "Daily yoga sessions helping individuals maintain physical and mental balance.",
  },
  {
    id: "17",
    name: "Karnali Yoga & Meditation",
    type: "Yoga Center",
    province: "Karnali",
    city: "Surkhet",
    address: "Birendranagar, Surkhet",
    phone: "083-520111",
    hours: "Morning & Evening",
    description: "Bringing yoga and wellness practices to the Karnali region.",
  },
];

export default function CrisisResourcesPage() {
  const searchParams = useSearchParams();
  // Get risk from URL if present (e.g. ?risk=high)
  const riskFromUrl = searchParams.get("risk")?.toLowerCase() || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [riskLevel, setRiskLevel] = useState<string>(
    ["high", "moderate", "low"].includes(riskFromUrl) ? riskFromUrl : "all",
  );

  // Derive available cities based on selected province (or all if none selected)
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    MOCK_RESOURCES.forEach((r) => {
      if (selectedProvince === "all" || r.province === selectedProvince) {
        cities.add(r.city);
      }
    });
    return Array.from(cities).sort();
  }, [selectedProvince]);

  // Filter resources
  // Filter resources
  const filteredResources = useMemo(() => {
    const filtered = MOCK_RESOURCES.filter((resource) => {
      // 1. Risk Level Filter (Pre-filters types)
      let matchesRisk = true;
      if (riskLevel === "high") {
        matchesRisk = [
          "Hospital",
          "Hotline",
          "Counseling Center",
          "Mental Health Clinic",
        ].includes(resource.type);
      } else if (riskLevel === "moderate") {
        matchesRisk = [
          "Counseling Center",
          "Hospital",
          "Mental Health Clinic",
        ].includes(resource.type);
      } else if (riskLevel === "low") {
        matchesRisk = resource.type === "Yoga Center";
      }

      // 2. Standard Filters
      const matchesSearch = resource.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesProvince =
        selectedProvince === "all" || resource.province === selectedProvince;
      const matchesCity =
        selectedCity === "all" || resource.city === selectedCity;
      const matchesType =
        selectedType === "all" || resource.type === selectedType;

      return (
        matchesRisk &&
        matchesSearch &&
        matchesProvince &&
        matchesCity &&
        matchesType
      );
    });

    // Sort priority: If Risk Level is High, show Hotlines first
    if (riskLevel === "high") {
      return filtered.sort((a, b) => {
        if (a.type === "Hotline" && b.type !== "Hotline") return -1;
        if (a.type !== "Hotline" && b.type === "Hotline") return 1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, selectedProvince, selectedCity, selectedType, riskLevel]);

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "Hospital":
        return <Hospital className="h-5 w-5 text-blue-500" />;
      case "Hotline":
        return <Phone className="h-5 w-5 text-red-500" />;
      case "Counseling Center":
        return <HeartHandshake className="h-5 w-5 text-pink-500" />;
      case "Mental Health Clinic":
        return <Stethoscope className="h-5 w-5 text-emerald-500" />;
      case "Yoga Center":
        return <Flower className="h-5 w-5 text-purple-500" />;
      default:
        return <ShieldAlert className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-[#FF6B98]" />
          Crisis Support & Resources
        </h1>
        <p className="text-muted-foreground text-lg text-center max-w-3xl">
          Find immediate help, counseling, and medical support near you. If you
          or someone you know is in immediate danger, please call national
          emergency numbers.
        </p>
      </div>

      {/* Emergency Global Banner */}
      <div className="bg-primary/15 border border-red-200 rounded-xl p-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full animate-pulse">
            <Phone className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-900">National Suicide Hotline</h3>
            <p className="text-red-700 text-sm">Available 24/7 • Toll Free</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="destructive" size="lg" className="font-bold text-lg">
            Call 1166
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
        {/* Top Row: Search & Risk Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name..."
              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#FF6B98]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[240px]">
            {/* Risk Level Filter */}
            <Select
              value={riskLevel}
              onValueChange={(val) => {
                setRiskLevel(val);
                setSelectedType("all");
              }}
            >
              <SelectTrigger className="w-full bg-white border-[#FF6B98] text-[#FF6B98] font-medium shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  <SelectValue placeholder="Screening Result" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk (Immediate Help)</SelectItem>
                <SelectItem value="moderate">Moderate Risk</SelectItem>
                <SelectItem value="low">Low Risk (Wellness)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom Row: Manual Filters */}
        <div className="flex flex-wrap gap-2 md:gap-4 md:flex-nowrap border-t border-gray-100 pt-4">
          <Select
            value={selectedType}
            onValueChange={(val) => setSelectedType(val)}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-gray-50">
              <SelectValue placeholder="Resource Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Hospital">Hospital</SelectItem>
              <SelectItem value="Hotline">Hotline</SelectItem>
              <SelectItem value="Counseling Center">
                Counseling Center
              </SelectItem>
              <SelectItem value="Mental Health Clinic">Clinic</SelectItem>
              <SelectItem value="Yoga Center">Yoga Center</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedProvince}
            onValueChange={(val) => {
              setSelectedProvince(val);
              setSelectedCity("all"); // Reset city when province changes
            }}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-gray-50">
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provinces</SelectItem>
              {NEPAL_PROVINCES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCity}
            onValueChange={(val) => setSelectedCity(val)}
            disabled={selectedProvince === "all" && availableCities.length > 50} // Optional optimization
          >
            <SelectTrigger className="w-full md:w-[180px] bg-gray-50">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {availableCities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Clear Filters */}
          <Button
            variant="ghost"
            size="icon"
            title="Clear Filters"
            className="ml-auto"
            onClick={() => {
              setSearchTerm("");
              setSelectedProvince("all");
              setSelectedCity("all");
              setSelectedType("all");
              setRiskLevel("all");
            }}
          >
            <Filter className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className="border-none shadow-sm hover:shadow-md transition-shadow group flex flex-col pb-1"
          >
            <CardHeader className="pb-1">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#FFF0F3] transition-colors">
                    {getTypeIcon(resource.type)}
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-normal text-muted-foreground border-gray-200"
                  >
                    {resource.type}
                  </Badge>
                </div>
                {resource.hotline && (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">
                    Hotline
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mt-2 leading-tight">
                {resource.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1">
                <MapPin className="h-3 w-3.5" />
                {resource.address}, {resource.city}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2 text-sm text-gray-600">
              <p className="line-clamp-3 leading-relaxed">
                {resource.description}
              </p>
              <div className="flex flex-col gap-2  border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{resource.hours}</span>
                </div>
                {resource.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-6 px-6">
              <Button className="w-full bg-primary hover:bg-[#ff5286] text-white shadow-sm font-semibold">
                <Phone className="mr-2 h-4 w-4" />
                Call {resource.phone}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No resources found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters.
          </p>
          <Button
            variant="link"
            className="text-[#FF6B98] mt-2"
            onClick={() => {
              setSearchTerm("");
              setSelectedProvince("all");
              setSelectedCity("all");
              setSelectedType("all");
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
