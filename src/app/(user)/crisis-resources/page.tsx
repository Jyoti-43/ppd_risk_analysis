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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useGetCrisisResourcesQuery } from "@/src/app/redux/services/crisisResourceApi";

import { CrisisResource, ResourceType } from "@/src/app/type";

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

// Resource types are now imported from types.ts
const EMPTY_ARRAY: any[] = [];
const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

// --- Mock Data (Nepal Context with Coordinates) ---

const NEPAL_PROVINCES = ["Bagmati"];

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
  const router = useRouter();
  const pathname = usePathname();

  // Get risk from URL if present (e.g. ?risk=high)
  const riskFromUrl = searchParams.get("risk")?.toLowerCase() || "all";
  const activeTab = searchParams.get("tab") || "emergency";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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

  // API Integration
  const { data: allResourcesData, isLoading: isAllLoading } =
    useGetCrisisResourcesQuery();
  const allResources = allResourcesData || EMPTY_ARRAY;
  const resources = allResources;

  // Load location from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      localStorage.removeItem("userLocation");
      return;
    }

    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        if (
          typeof parsedLocation.lat === "number" &&
          typeof parsedLocation.lng === "number"
        ) {
          setUserLocation(parsedLocation);
        }
      } catch (e) {
        console.error("Failed to parse saved location", e);
      }
    }
  }, []);

  // Request user location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        localStorage.setItem("userLocation", JSON.stringify(newLocation));
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
    allResources.forEach((r) => {
      if (selectedProvince === "all" || r.province === selectedProvince) {
        cities.add(r.city);
      }
    });
    return Array.from(cities).sort();
  }, [selectedProvince, allResources]);

  // 1. Base Pool: Filter by Search, Location, Province, City
  const processedResources = useMemo(() => {
    let base = resources.map((r) => {
      let distance: number | undefined;
      if (typeof r.distance_km === "number" && r.distance_km !== null) {
        distance = r.distance_km;
      } else if (
        userLocation &&
        typeof userLocation.lat === "number" &&
        typeof userLocation.lng === "number" &&
        typeof r.lat === "number" &&
        typeof r.lng === "number" &&
        r.lat !== 0 &&
        r.lng !== 0
      ) {
        distance = calculateHaversineDistance(
          userLocation.lat,
          userLocation.lng,
          r.lat,
          r.lng,
        );
      }
      return distance !== undefined ? { ...r, distance } : r;
    });

    // Apply Global Filters (Search, Province, City)
    return base.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvince =
        selectedProvince === "all" || resource.province === selectedProvince;
      const matchesCity =
        selectedCity === "all" || resource.city === selectedCity;

      return matchesSearch && matchesProvince && matchesCity;
    });
  }, [resources, searchTerm, selectedProvince, selectedCity, userLocation]);

  // 2. Emergency Resources (Safety First: Always show regardless of risk/type filter)
  const emergencyResources = useMemo(() => {
    let filtered = processedResources.filter((r) => r.type === "emergency");

    // Sorting
    if (userLocation) {
      filtered.sort(
        (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
      );
    }
    return filtered;
  }, [processedResources, userLocation]);

  // 3. Support Services (Contextual: Respect Risk and Type filters)
  const otherResources = useMemo(() => {
    let filtered = processedResources.filter((r) => r.type !== "emergency");

    // Apply Risk Level Filter (if assessment exists)
    if (riskLevel !== "all") {
      filtered = filtered.filter((resource) => {
        if (riskLevel === "high") {
          return ["hospital", "counseling", "community_support"].includes(
            resource.type,
          );
        } else if (riskLevel === "moderate") {
          return ["counseling", "hospital", "community_support"].includes(
            resource.type,
          );
        } else if (riskLevel === "low") {
          return resource.type === "wellness";
        }
        return true;
      });
    }

    // Apply Type Filter
    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => {
        if (selectedType === "non-emergency") return true; // Already filtered out emergency
        return resource.type === selectedType;
      });
    }

    // Sorting
    if (userLocation) {
      filtered.sort(
        (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
      );
    }

    return filtered;
  }, [processedResources, riskLevel, selectedType, userLocation]);

  // For Map display
  const filteredResources = useMemo(
    () => [...emergencyResources, ...otherResources],
    [emergencyResources, otherResources],
  );

  // Final resource separation and logging
  useEffect(() => {
    if (filteredResources.length > 0) {
      console.log("Current Filtered Resources:", filteredResources);
    }
  }, [filteredResources]);

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "hospital":
        return <Hospital className="h-5 w-5 text-blue-500" />;
      case "emergency":
        return <Phone className="h-5 w-5 text-red-500" />;
      case "counseling":
        return <HeartHandshake className="h-5 w-5 text-pink-500" />;
      case "community_support":
        return <Stethoscope className="h-5 w-5 text-emerald-500" />;
      case "wellness":
        return <Flower className="h-5 w-5 text-purple-500" />;
      default:
        return <ShieldAlert className="h-5 w-5 text-gray-500" />;
    }
  };

  // Calculate center based on user location, filtered resources or default to Nepal
  const mapCenter: [number, number] = useMemo(() => {
    if (
      userLocation &&
      typeof userLocation.lat === "number" &&
      typeof userLocation.lng === "number"
    ) {
      return [userLocation.lat, userLocation.lng];
    }

    if (selectedCity !== "all") {
      const cityResource = allResources.find(
        (r: any) =>
          r.city === selectedCity &&
          typeof r.lat === "number" &&
          typeof r.lng === "number",
      );
      if (cityResource) return [cityResource.lat, cityResource.lng];
    }
    return NEPAL_CENTER;
  }, [allResources, selectedCity, userLocation]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Crisis Resources
          </h1>
          <p className="text-gray-500 font-medium">
            Verified emergency support and wellness centers across Nepal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowMap(!showMap)}
            variant="outline"
            className="rounded-xl border-gray-200 hover:bg-gray-50 font-semibold"
          >
            {showMap ? (
              <>
                <Search className="mr-2 h-4 w-4" /> Hide Map
              </>
            ) : (
              <>
                <MapIcon className="mr-2 h-4 w-4" /> Show Map
              </>
            )}
          </Button>
          <Button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="bg-primary hover:bg-[#ff5286] text-white rounded-xl shadow-lg shadow-pink-100 font-bold transition-all active:scale-95"
          >
            {isLocating ? (
              "Locating..."
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" /> Near Me
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="w-full">
          <ResourceMap
            resources={filteredResources}
            center={mapCenter}
            userLocation={userLocation}
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or address..."
              className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-primary focus-visible:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={selectedType}
            onValueChange={(val) => {
              setSelectedType(val);
              if (val === "emergency") {
                handleTabChange("emergency");
              } else if (val !== "all") {
                handleTabChange("support");
              }
            }}
          >
            <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium">
              <SelectValue placeholder="Resource Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem
                value="non-emergency"
                className="text-primary font-semibold"
              >
                Support Services Only
              </SelectItem>
              <hr className="my-1 border-gray-100" />
              <SelectItem value="emergency">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-500" />
                  <span>Emergency Hotlines</span>
                </div>
              </SelectItem>
              <SelectItem value="hospital">
                <div className="flex items-center gap-2">
                  <Hospital className="h-4 w-4 text-blue-500" />
                  <span>Medical Hospitals</span>
                </div>
              </SelectItem>
              <SelectItem value="counseling">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-pink-500" />
                  <span>Counseling Centers</span>
                </div>
              </SelectItem>
              <SelectItem value="community_support">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-emerald-500" />
                  <span>Community Support</span>
                </div>
              </SelectItem>
              <SelectItem value="wellness">
                <div className="flex items-center gap-2">
                  <Flower className="h-4 w-4 text-purple-500" />
                  <span>Wellness & Yoga</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedProvince}
            onValueChange={(val) => {
              setSelectedProvince(val);
              setSelectedCity("all");
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

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-10"
      >
        <div className="border-b border-gray-100 mb-8">
          <TabsList className="flex justify-start gap-8 bg-transparent h-auto p-0 rounded-none border-none">
            <TabsTrigger
              value="emergency"
              className="group flex items-center gap-2.5 px-0 pb-4 rounded-none border-b-2 border-transparent bg-transparent font-bold text-gray-500 transition-all 
                         data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              <ShieldAlert className="h-5 w-5 transition-colors group-data-[state=active]:text-primary" />
              <span className="text-base uppercase tracking-tight">
                Emergency
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="group flex items-center gap-2.5 px-0 pb-4 rounded-none border-b-2 border-transparent bg-transparent font-bold text-gray-500 transition-all 
                         data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              <HeartHandshake className="h-5 w-5 transition-colors group-data-[state=active]:text-primary" />
              <span className="text-base uppercase tracking-tight">
                Support Services
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="emergency"
          className="space-y-8  focus-visible:outline-none outline-none mt-2"
        >
          {emergencyResources.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xl font-black text-red-900 uppercase tracking-tight">
                  Emergency Hotlines (24/7)
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {/* National Suicide Hotline Static Banner */}
                <div className="bg-white border border-red-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border-l-4 border-l-red-500">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="p-4 bg-red-100 rounded-full animate-pulse shrink-0">
                      <Phone className="h-7 w-7 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">
                        National Suicide Hotline
                      </h3>
                      <p className="text-gray-600 font-medium">
                        Available 24/7 across Nepal • Toll Free Helpline
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 w-full md:w-auto">
                    <Button
                      asChild
                      variant="destructive"
                      className="w-full md:w-auto font-bold text-xl px-10 py-7 rounded-2xl shadow-lg hover:scale-105 transition-transform"
                    >
                      <a href="tel:1166" className="flex items-center gap-3">
                        <Phone className="h-6 w-6" />
                        Call 1166
                      </a>
                    </Button>
                  </div>
                </div>

                {emergencyResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white border border-red-100 rounded-3xl p-6 md:py-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border-l-4 border-l-red-500 group transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex-1 space-y-2 text-center lg:text-left">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-4 bg-red-100 rounded-full animate-pulse shrink-0">
                          <Phone className="h-7 w-7 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl">
                            {resource.name}
                          </h3>
                          <p className="text-red-500 text-sm font-medium mt-1">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-4 text-gray-900 md:pl-20 mt-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold opacity-80">
                            {resource.address}, {resource.city}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 w-full md:w-auto">
                      <Button
                        asChild
                        variant="destructive"
                        className="w-full md:w-auto font-bold text-lg px-10 py-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
                      >
                        <a
                          href={`tel:${resource.phone}`}
                          className="flex items-center gap-3"
                        >
                          <Phone className="h-5 w-5" />
                          Call {resource.phone}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
              <Phone className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">
                No emergency hotlines available
              </h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your location or filters.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="support"
          className="space-y-8 focus-visible:outline-none outline-none mt-0"
        >
          {otherResources.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Support Services ({otherResources.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherResources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col pb-1 rounded-2xl overflow-hidden bg-white hover:-translate-y-1"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-[#FFF0F3] group-hover:text-primary transition-all duration-300">
                            {getTypeIcon(resource.type)}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs font-semibold px-2.5 py-0.5 bg-gray-100 text-gray-600 border-none rounded-lg"
                          >
                            {resource.type === "community_support"
                              ? "Community"
                              : resource.type}
                          </Badge>
                        </div>
                        {resource.distance !== undefined && (
                          <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-2 rounded-full text-[11px] font-bold">
                            {resource.distance < 1
                              ? `${(resource.distance * 1000).toFixed(0)}m`
                              : `${resource.distance.toFixed(1)}km`}{" "}
                            away
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
                    <CardContent className="flex-1 space-y-4 pt-1">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 italic">
                        "{resource.description}"
                      </p>
                      <div className="space-y-2.5 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="p-1.5 bg-blue-50 rounded-lg">
                            <Clock className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium">
                            {resource.hours}
                          </span>
                        </div>
                        {resource.website && (
                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-indigo-50 rounded-lg">
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
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
              <ShieldAlert className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">
                No support services found
              </h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or location searching.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
