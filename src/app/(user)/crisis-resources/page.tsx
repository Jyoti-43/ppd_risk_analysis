"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
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
  Map as MapIcon,
  Navigation,
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
import { toast } from "sonner";

// Dynamic import for Leaflet map to avoid SSR issues
const ResourceMap = dynamic(
  () => import("@/src/app/component/crisis-resources/ResourceMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
        Loading Map...
      </div>
    ),
  },
);

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
  lat: number;
  lng: number;
  distance?: number;
}

// --- Mock Data (Nepal Context with Coordinates) ---
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
    lat: 27.7289,
    lng: 85.3304,
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
    lat: 27.6691,
    lng: 85.3206,
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
    lat: 27.6588,
    lng: 85.3129,
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
    lat: 27.6915,
    lng: 85.3217,
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
    lat: 28.2163,
    lng: 83.9922,
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
    lat: 27.7052,
    lng: 83.4542,
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
    lat: 27.6685,
    lng: 85.3212,
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
    lat: 26.4589,
    lng: 87.2831,
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
    lat: 27.6833,
    lng: 84.4333,
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
    lat: 28.7047,
    lng: 80.5901,
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
    lat: 27.7444,
    lng: 85.2585,
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
    lat: 28.2104,
    lng: 83.9575,
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
    lat: 27.7271,
    lng: 85.3341,
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
    lat: 27.4789,
    lng: 83.2751,
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
    lat: 27.6548,
    lng: 85.3268,
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
    lat: 26.4601,
    lng: 87.2798,
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
    lat: 28.5983,
    lng: 81.6355,
  },
];

// Haversine formula to calculate distance in km
const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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
  const [showMap, setShowMap] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Request user location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        toast.success("Location updated successfully!");
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = "Unable to retrieve your location";
        if (error.code === 1) errorMsg = "Location permission denied";
        toast.error(errorMsg);
      },
      { enableHighAccuracy: true },
    );
  };

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

  // Filter and Sort resources
  const filteredResources = useMemo(() => {
    let filtered = MOCK_RESOURCES.map((r) => {
      if (userLocation) {
        return {
          ...r,
          distance: calculateHaversineDistance(
            userLocation.lat,
            userLocation.lng,
            r.lat,
            r.lng,
          ),
        };
      }
      return r;
    }).filter((resource) => {
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
      const matchesSearch =
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.address.toLowerCase().includes(searchTerm.toLowerCase());
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

    // Final sorting
    if (userLocation) {
      // Sort by distance if location available
      return filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (riskLevel === "high") {
      // Otherwise sort by priority if high risk
      return filtered.sort((a, b) => {
        if (a.type === "Hotline" && b.type !== "Hotline") return -1;
        if (a.type !== "Hotline" && b.type === "Hotline") return 1;
        return 0;
      });
    }

    return filtered;
  }, [
    searchTerm,
    selectedProvince,
    selectedCity,
    selectedType,
    riskLevel,
    userLocation,
  ]);

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

  // Calculate center based on user location, filtered resources or default to Nepal
  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (filteredResources.length > 0 && selectedCity !== "all") {
      const cityResource = filteredResources.find(
        (r) => r.city === selectedCity,
      );
      if (cityResource) return [cityResource.lat, cityResource.lng];
    }
    return [28.3949, 84.124]; // Center of Nepal
  }, [filteredResources, selectedCity, userLocation]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
            <ShieldAlert className="h-8 w-8 text-[#FF6B98]" />
            Crisis Support & Resources
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Find immediate help, counseling, and medical support near you. If
            you or someone you know is in immediate danger, please call national
            emergency numbers.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGetLocation}
            variant="outline"
            disabled={isLocating}
            className={`transition-all duration-300 ${userLocation ? "border-green-200 bg-green-50 text-green-700" : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50"}`}
          >
            {isLocating ? (
              <Navigation className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="mr-2 h-4 w-4" />
            )}
            {userLocation ? "Location Updated" : "Use My Location"}
          </Button>
          <Button
            onClick={() => setShowMap(!showMap)}
            variant="outline"
            className="bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
          >
            {showMap ? (
              <Search className="mr-2 h-4 w-4" />
            ) : (
              <MapIcon className="mr-2 h-4 w-4" />
            )}
            {showMap ? "Show Grid Only" : "Show Map View"}
          </Button>
        </div>
      </div>

      {/* Emergency Global Banner */}
      <div className="bg-primary/10 border border-pink-200 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border-l-4 border-l-red-500">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-red-100 rounded-full animate-pulse">
            <Phone className="h-7 w-7 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xl">
              National Suicide Hotline
            </h3>
            <p className="text-gray-600">
              Available 24/7 across Nepal • Toll Free Helpline
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="destructive"
            size="lg"
            className="font-bold text-xl px-8 py-7 rounded-xl shadow-lg hover:scale-105 transition-transform w-full sm:w-auto"
          >
            Call 1166
          </Button>
        </div>
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <MapPin className="h-5 w-5 text-gray-400" />
              Interactive Resource Map
            </div>
            {userLocation && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-100"
              >
                Map centered on your location
              </Badge>
            )}
          </div>
          <ResourceMap
            resources={filteredResources}
            center={mapCenter}
            zoom={userLocation ? 13 : selectedCity !== "all" ? 12 : 7}
            userLocation={userLocation}
          />
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        {/* Top Row: Search & Risk Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-4 text-gray-400" />
            <Input
              placeholder="Search resource by name, address or city..."
              className="pl-12 h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-[#FF6B98] text-base rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[280px]">
            {/* Risk Level Filter */}
            <Select
              value={riskLevel}
              onValueChange={(val) => {
                setRiskLevel(val);
                setSelectedType("all");
              }}
            >
              <SelectTrigger className="w-full h-12 bg-white border-[#FF6B98] text-[#FF6B98] font-bold shadow-sm rounded-xl px-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  <SelectValue placeholder="Filter by Risk Level" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-pink-100">
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high" className="font-semibold text-red-600">
                  High Risk (Emergency)
                </SelectItem>
                <SelectItem
                  value="moderate"
                  className="font-semibold text-orange-600"
                >
                  Moderate Risk
                </SelectItem>
                <SelectItem
                  value="low"
                  className="font-semibold text-green-600"
                >
                  Low Risk (Wellness)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom Row: Manual Filters */}
        <div className="flex flex-wrap gap-3 md:flex-nowrap border-t border-gray-50 pt-6">
          <Select
            value={selectedType}
            onValueChange={(val) => setSelectedType(val)}
          >
            <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50/50 border-gray-100 rounded-xl">
              <SelectValue placeholder="Resource Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
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
            <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50/50 border-gray-100 rounded-xl">
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
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
          >
            <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50/50 border-gray-100 rounded-xl">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Cities</SelectItem>
              {availableCities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            title="Clear Filters"
            className="ml-auto h-11 w-11 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors"
            onClick={() => {
              setSearchTerm("");
              setSelectedProvince("all");
              setSelectedCity("all");
              setSelectedType("all");
              setRiskLevel("all");
            }}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Results Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Available Resources ({filteredResources.length})
          {userLocation && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (Sorted by proximity)
            </span>
          )}
        </h2>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col pb-1 rounded-2xl overflow-hidden bg-white hover:-translate-y-1"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-[#FFF0F3] group-hover:text-primary transition-all duration-300">
                    {getTypeIcon(resource.type)}
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold px-2.5 py-0.5 bg-gray-100 text-gray-600 border-none rounded-lg"
                  >
                    {resource.type}
                  </Badge>
                </div>
                {resource.distance !== undefined && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 rounded-full text-[11px] font-bold">
                    {resource.distance < 1
                      ? `${(resource.distance * 1000).toFixed(0)}m`
                      : `${resource.distance.toFixed(1)}km`}{" "}
                    away
                  </Badge>
                )}
                {resource.hotline && !resource.distance && (
                  <Badge className="bg-red-500 text-white hover:bg-red-600 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    24/7 Hotline
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mt-4 leading-tight group-hover:text-primary transition-colors">
                {resource.name}
              </CardTitle>
              <CardDescription className="flex items-start gap-1.5 mt-2 text-gray-500">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span className="text-sm">
                  {resource.address}, {resource.city}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-4">
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 italic">
                "{resource.description}"
              </p>
              <div className="space-y-2.5 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">{resource.hours}</span>
                </div>
                {resource.website && (
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <Globe className="h-4 w-4 text-indigo-500" />
                    </div>
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-4 pb-6 px-6">
              <Button
                asChild
                className="w-full bg-primary hover:bg-[#ff5286] text-white shadow-md font-bold h-12 rounded-xl transition-all active:scale-95"
              >
                <a href={`tel:${resource.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call {resource.phone}
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center p-6 bg-gray-50 rounded-full mb-6">
            <Search className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            No resources found
          </h3>
          <p className="text-muted-foreground text-lg mt-2 max-w-sm mx-auto">
            Try adjusting your province, city or search term to find support
            centers near you.
          </p>
          <Button
            variant="outline"
            className="mt-8 border-primary text-primary hover:bg-primary/5 rounded-xl px-8"
            onClick={() => {
              setSearchTerm("");
              setSelectedProvince("all");
              setSelectedCity("all");
              setSelectedType("all");
              setRiskLevel("all");
            }}
          >
            Reset all filters
          </Button>
        </div>
      )}

      {/* Bottom Footer Tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
        <p className="text-blue-800 font-medium">
          💡 Tip: You can view these resources directly on the map above to find
          the one closest to your current location.
        </p>
      </div>
    </div>
  );
}
