import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ChevronLeft,
  MapPin,
  Film,
  CreditCard,
  Star,
  LocateFixed,
  Search,
  Play,
  X,
  Check,
} from "lucide-react";
import { SeatMap } from "@/components/SeatMap";
import {
  searchCinemas,
  getAllMovies,
  searchCinemasByMovie,
  getShowtimesByMovie,
  getSeatMap,
  type Cinema,
  type Movie,
  type Showtime,
  type Seat,
} from "@/services/cinemaService";
import { createMovieBooking } from "@/services/movieBookingService";
import {
  getVnProvinceOptions,
  getIntlDestinations,
  type CityOption,
} from "@/services/locationClient";
import { reverseGeocode } from "@/services/geocodeService";
import { Geolocation } from "@capacitor/geolocation";
import { fbAuth } from "@/lib/firebase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Step = 1 | 2 | 3;

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
}

export default function MovieBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  // Location mode
  const [locationMode, setLocationMode] = useState<"vn" | "intl">("vn");
  const [loadingGeo, setLoadingGeo] = useState(false);

  // Step 1: Location & Cinema
  const [vnProvinces, setVnProvinces] = useState<CityOption[]>([]);
  const [intlDestinations] = useState<CityOption[]>(getIntlDestinations());
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedIntlCity, setSelectedIntlCity] = useState<string>("");
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [loadingCinemas, setLoadingCinemas] = useState(false);

  // Movie search filter
  const [movieSearchName, setMovieSearchName] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<"all" | "4+" | "4.5+">(
    "all"
  );

  // Step 2: Movie, Showtime & Seats
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  );
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Step 3: Payment
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load accounts when entering step 3
  useEffect(() => {
    if (step === 3 && accounts.length === 0) {
      /* console.log removed */
      loadAccounts();
    }
  }, [step]);

  const loadProvinces = async () => {
    try {
      const data = await getVnProvinceOptions();
      setVnProvinces(data);
    } catch (error) {
      console.error("Error loading provinces:", error);
      toast.error("Không thể tải danh sách tỉnh thành");
    }
  };

  // Resolve city key based on location mode
  const resolveCityKey = (): string => {
    if (locationMode === "vn") {
      if (selectedProvince) {
        const provinceToKey: Record<string, string> = {
          "1": "VN_HN", // Hà Nội
          "01": "VN_HN", // Hà Nội (with leading zero)
          "79": "VN_HCM", // TP.HCM (Hồ Chí Minh)
          "48": "VN_DN", // Đà Nẵng
          "56": "VN_NT", // Khánh Hòa (Nha Trang)
          "92": "VN_CT", // Cần Thơ
          "77": "VN_VT", // Bà Rịa-Vũng Tàu (Vũng Tàu)
        };
        const resolved =
          provinceToKey[selectedProvince] || `VN_${selectedProvince}`;
        /* console.log removed */
        return resolved;
      }
    } else {
      if (selectedIntlCity) {
        /* console.log removed */
        return selectedIntlCity;
      }
    }
    return "";
  };

  // GPS suggestion handler
  const handleGeoSuggest = async () => {
    try {
      setLoadingGeo(true);

      let lat: number, lon: number;

      try {
        const perm = await Geolocation.requestPermissions();
        if (perm?.location === "denied")
          throw new Error("Quyền vị trí bị từ chối");
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch (capacitorErr) {
        if (!navigator.geolocation) {
          throw new Error("Trình duyệt không hỗ trợ GPS");
        }
        const pos = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
            });
          }
        );
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      }

      const result = await reverseGeocode(lat, lon);
      const country = result.country || "";
      const isVietnam =
        country.toLowerCase().includes("vietnam") ||
        country.toLowerCase().includes("việt nam");

      if (isVietnam) {
        setLocationMode("vn");
        const provinceName = result.state || result.city || "";
        const matchedProvince = vnProvinces.find(
          (p) =>
            p.label.toLowerCase().includes(provinceName.toLowerCase()) ||
            provinceName.toLowerCase().includes(p.label.toLowerCase())
        );

        if (matchedProvince) {
          setSelectedProvince(matchedProvince.key);
        } else {
          setSelectedProvince("79"); // Default to HCM
        }
      } else {
        setLocationMode("intl");
        const city = result.city || result.state || country;
        const matchedDest = intlDestinations.find(
          (d) =>
            d.label.toLowerCase().includes(city.toLowerCase()) ||
            city.toLowerCase().includes(d.label.toLowerCase())
        );

        if (matchedDest) {
          setSelectedIntlCity(matchedDest.key);
        }
      }

      toast.success(
        `Đã phát hiện vị trí: ${result.displayName || "Không xác định"}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Không thể lấy vị trí GPS. Vui lòng chọn thủ công.");
    } finally {
      setLoadingGeo(false);
    }
  };

  // Load cinemas based on filters
  const loadCinemas = async () => {
    const cityKey = resolveCityKey();
    /* console.log removed */

    if (!cityKey) {
      toast.error("Vui lòng chọn khu vực");
      return;
    }

    setLoadingCinemas(true);
    try {
      let data: Cinema[] = [];

      // If searching by movie name
      if (movieSearchName.trim()) {
        /* console.log removed */
        data = await searchCinemasByMovie(movieSearchName, cityKey);
        /* console.log removed */
        if (data.length === 0) {
          toast.info(`Không tìm thấy rạp chiếu phim "${movieSearchName}"`);
        }
      } else {
        // Normal search by location
        /* console.log removed */
        data = await searchCinemas(cityKey);
        /* console.log removed */
        if (data.length === 0) {
          toast.info("Không tìm thấy rạp phim tại khu vực này");
        }
      }

      // Apply rating filter
      const beforeFilter = data.length;
      if (ratingFilter === "4+") {
        data = data.filter((c) => c.rating >= 4.0);
      } else if (ratingFilter === "4.5+") {
        data = data.filter((c) => c.rating >= 4.5);
      }
      /* console.log removed */

      setCinemas(data);
    } catch (error) {
      console.error("❌ Error loading cinemas:", error);
      toast.error("Không thể tải danh sách rạp phim");
    } finally {
      setLoadingCinemas(false);
    }
  };

  const handleCinemaSelect = (cinema: Cinema) => {
    setSelectedCinema(cinema);
  };

  const handleStep1Next = () => {
    if (!selectedCinema) {
      toast.error("Vui lòng chọn rạp phim");
      return;
    }
    loadMoviesForStep2();
    setStep(2);
  };

  // Step 2: Load all movies (not cinema-specific)
  const loadMoviesForStep2 = async () => {
    setLoadingMovies(true);
    try {
      const data = await getAllMovies();
      setMovies(data);
      if (data.length === 0) {
        toast.info("Không có phim nào");
      }
    } catch (error) {
      console.error("Error loading movies:", error);
      toast.error("Không thể tải danh sách phim");
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowTrailerModal(true);
    setSelectedShowtime(null);
    setSeats([]);
    setSelectedSeats([]);
    // Auto-load showtimes when movie is selected
    if (selectedCinema) {
      loadShowtimes(selectedCinema.id, movie.id);
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailerModal(false);
  };

  const handleViewShowtimes = () => {
    setShowTrailerModal(false);
    if (selectedCinema && selectedMovie) {
      loadShowtimes(selectedCinema.id, selectedMovie.id);
    }
  };

  const loadShowtimes = async (cinemaId: string, movieId: string) => {
    setLoadingShowtimes(true);
    try {
      const data = await getShowtimesByMovie(cinemaId, movieId);
      setShowtimes(data);
      if (data.length === 0) {
        toast.info("Không có suất chiếu cho phim này");
      }
    } catch (error) {
      console.error("Error loading showtimes:", error);
      toast.error("Không thể tải lịch chiếu");
    } finally {
      setLoadingShowtimes(false);
    }
  };

  const handleShowtimeSelect = async (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    loadSeats(showtime.id);
  };

  const loadSeats = async (showtimeId: string) => {
    setLoadingSeats(true);
    try {
      const data = await getSeatMap(showtimeId);
      setSeats(data);
    } catch (error) {
      console.error("Error loading seats:", error);
      toast.error("Không thể tải sơ đồ ghế");
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatSelectionChange = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const getTotalAmount = () => {
    if (!selectedShowtime || selectedSeats.length === 0) return 0;
    return selectedShowtime.pricePerSeat * selectedSeats.length;
  };

  // Render star rating
  const renderStars = (rating: number) => {
    // Handle invalid ratings
    if (typeof rating !== "number" || isNaN(rating) || !isFinite(rating)) {
      rating = 0;
    }

    // Clamp rating between 0 and 5
    const clampedRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.max(0, Math.floor(clampedRating));
    const hasHalfStar = clampedRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - Math.ceil(clampedRating));

    return (
      <div className="flex items-center gap-0.5">
        {fullStars > 0 &&
          [...Array(fullStars)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
        {hasHalfStar && (
          <Star
            size={12}
            className="fill-yellow-400 text-yellow-400"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        )}
        {emptyStars > 0 &&
          [...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} size={12} className="text-gray-300" />
          ))}
        <span className="ml-1 text-xs text-muted-foreground">
          ({clampedRating.toFixed(1)})
        </span>
      </div>
    );
  };

  const handleStep2Next = async () => {
    if (!selectedMovie) {
      toast.error("Vui lòng chọn phim");
      return;
    }
    if (!selectedShowtime) {
      toast.error("Vui lòng chọn suất chiếu");
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế");
      return;
    }
    await loadAccounts();
    setStep(3);
  };

  // Step 3: Load accounts
  const loadAccounts = async () => {
    const user = fbAuth.currentUser;
    /* console.log removed */

    if (!user) {
      console.error("❌ No user logged in");
      toast.error("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }

    setLoadingAccounts(true);
    try {
      // Import Realtime Database functions
      const { ref, get } = await import("firebase/database");
      const { fbRtdb } = await import("@/lib/firebase");

      const accountsRef = ref(fbRtdb, "accounts");
      const snap = await get(accountsRef);

      if (!snap.exists()) {
        /* console.log removed */
        setAccounts([]);
        toast.error("Bạn chưa có tài khoản thanh toán");
        setLoadingAccounts(false);
        return;
      }

      /* console.log removed */

      const accountList: Account[] = [];
      snap.forEach((child) => {
        const v = child.val();
        /* console.log removed */
        if (v?.uid === user.uid) {
          const balance =
            typeof v.balance === "number" ? v.balance : Number(v.balance || 0);
          accountList.push({
            id: child.key ?? "",
            accountNumber: child.key ?? "",
            accountType: v.accountType || "Tài khoản thanh toán",
            balance: balance,
          });
        }
        return false;
      });

      /* console.log removed */
      setAccounts(accountList);

      if (accountList.length === 0) {
        toast.error("Bạn chưa có tài khoản thanh toán");
      } else {
        // Auto-select first account
        setSelectedAccountId(accountList[0].id);
      }
    } catch (error) {
      console.error("❌ Error loading accounts:", error);
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedCinema || !selectedMovie || !selectedShowtime) {
      toast.error("Thông tin đặt vé không đầy đủ");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế");
      return;
    }

    if (!selectedAccountId) {
      toast.error("Vui lòng chọn tài khoản thanh toán");
      return;
    }

    const totalAmount = getTotalAmount();
    const user = fbAuth.currentUser;

    if (!user) {
      toast.error("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }

    // Navigate to PIN screen with payment request
    navigate("/utilities/pin", {
      state: {
        pendingRequest: {
          type: "MOVIE",
          amount: totalAmount,
          accountId: selectedAccountId,
          details: {
            cinemaId: selectedCinema.id,
            cinemaName: selectedCinema.name,
            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            showtimeId: selectedShowtime.id,
            date: selectedShowtime.date,
            time: selectedShowtime.time,
            room: selectedShowtime.room,
            selectedSeats,
            // Add formData for receipt building
            formData: {
              movieCinema: selectedCinema.name,
              movieName: selectedMovie.title,
              movieDate: selectedShowtime.date,
              movieTime: selectedShowtime.time,
              movieTickets: String(selectedSeats.length),
            },
          },
        },
        returnPath: "/utilities/movie-booking",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
      <header className="bg-gradient-to-br from-primary to-accent p-6 pb-6 text-primary-foreground">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-2.5 py-2.5 text-sm font-semibold hover:bg-white/20"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="leading-tight">
              <p className="text-xs opacity-80">Tiện ích – Giải trí</p>
              <h1 className="text-xl font-semibold">Đặt vé xem phim</h1>
            </div>
          </div>
          <Badge className="bg-white/20 text-primary-foreground border-white/40">
            Beta
          </Badge>
        </div>
      </header>

      <div className="mx-auto w-full max-w-8xl -mt-3.5 px-4 md:px-6">
        <Card className="overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-primary to-accent px-4 py-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">BƯỚC {step} / 3</p>
                <h2 className="text-lg font-semibold">Quy trình đặt vé</h2>
              </div>
              <Badge className="border-white/40 bg-white/15 text-primary-foreground">
                An toàn
              </Badge>
            </div>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              {[
                { label: "Chọn rạp", icon: MapPin, id: 1 },
                { label: "Chọn phim & ghế", icon: Film, id: 2 },
                { label: "Thanh toán", icon: CreditCard, id: 3 },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className="flex flex-1 items-center gap-3"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-primary-foreground shadow-sm ${
                      step >= item.id
                        ? "border-white bg-white/90 text-primary"
                        : "border-white/60 bg-white/20"
                    }`}
                  >
                    <item.icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-primary-foreground/80">
                      Bước {idx + 1}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        step >= item.id
                          ? "text-primary-foreground"
                          : "text-primary-foreground/70"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                  <div className="hidden h-px flex-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30 md:block" />
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Location & Cinema */}
          {step === 1 && (
            <div className="grid gap-4 p-5 md:p-6 bg-white">
              {/* Location Mode Tabs and GPS Button */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant={locationMode === "vn" ? "default" : "outline"}
                    onClick={() => {
                      setLocationMode("vn");
                      setSelectedProvince("");
                      setSelectedIntlCity("");
                      setCinemas([]);
                      setSelectedCinema(null);
                    }}
                  >
                    Việt Nam
                  </Button>
                  <Button
                    size="sm"
                    variant={locationMode === "intl" ? "default" : "outline"}
                    onClick={() => {
                      setLocationMode("intl");
                      setSelectedProvince("");
                      setSelectedIntlCity("");
                      setCinemas([]);
                      setSelectedCinema(null);
                    }}
                  >
                    Quốc tế
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={handleGeoSuggest}
                  disabled={loadingGeo}
                >
                  <LocateFixed size={16} className="mr-2" />
                  {loadingGeo ? "Đang lấy vị trí..." : "Gợi ý GPS"}
                </Button>
              </div>

              {/* Location Selection - Vietnam */}
              {locationMode === "vn" && (
                <div className="space-y-3">
                  <p className="text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                    Chọn địa điểm Việt Nam
                  </p>
                  <div className="grid gap-1">
                    <Label className="text-xs text-muted-foreground">
                      Tỉnh/Thành phố
                    </Label>
                    <select
                      className="w-full rounded-xl border bg-background p-3 text-sm"
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                    >
                      <option value="">Chọn tỉnh/thành</option>
                      {vnProvinces.map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Location Selection - International */}
              {locationMode === "intl" && (
                <div className="space-y-3">
                  <p className="text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                    Chọn địa điểm quốc tế
                  </p>
                  <div className="grid gap-1">
                    <Label className="text-xs text-muted-foreground">
                      Điểm đến phổ biến
                    </Label>
                    <select
                      className="w-full rounded-xl border bg-background p-3 text-sm"
                      value={selectedIntlCity}
                      onChange={(e) => setSelectedIntlCity(e.target.value)}
                    >
                      <option value="">Chọn điểm đến</option>
                      {intlDestinations.map((d) => (
                        <option key={d.key} value={d.key}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Movie Search Filter */}
              <div className="rounded-2xl border p-4">
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Search size={16} className="text-emerald-700" />
                  Tìm theo tên phim
                </div>
                <Input
                  placeholder="Nhập tên phim để tìm rạp chiếu..."
                  value={movieSearchName}
                  onChange={(e) => setMovieSearchName(e.target.value)}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Để trống để xem tất cả rạp trong khu vực
                </p>
              </div>

              {/* Rating Filter */}
              <div className="rounded-2xl border p-4">
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Star size={16} className="text-emerald-700" />
                  Lọc theo đánh giá rạp
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={ratingFilter === "all" ? "default" : "outline"}
                    onClick={() => setRatingFilter("all")}
                  >
                    Tất cả
                  </Button>
                  <Button
                    size="sm"
                    variant={ratingFilter === "4+" ? "default" : "outline"}
                    onClick={() => setRatingFilter("4+")}
                  >
                    4★+
                  </Button>
                  <Button
                    size="sm"
                    variant={ratingFilter === "4.5+" ? "default" : "outline"}
                    onClick={() => setRatingFilter("4.5+")}
                  >
                    4.5★+
                  </Button>
                </div>
              </div>

              {/* Search Button */}
              <Button onClick={loadCinemas} disabled={loadingCinemas}>
                {loadingCinemas ? "Đang tìm..." : "Tìm rạp phim"}
              </Button>

              {/* Cinema List */}
              {loadingCinemas && (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingCinemas && cinemas.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground">
                    Rạp phim ({cinemas.length} kết quả)
                  </Label>
                  {cinemas.map((cinema) => (
                    <Card
                      key={cinema.id}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        selectedCinema?.id === cinema.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleCinemaSelect(cinema)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-base">
                            {cinema.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {cinema.address}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="text-xs text-muted-foreground">
                              {cinema.rooms} phòng chiếu
                            </div>
                            {renderStars(cinema.rating)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!loadingCinemas &&
                cinemas.length === 0 &&
                (selectedProvince || selectedIntlCity) && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Không tìm thấy rạp phim. Vui lòng thử lại với khu vực khác.
                  </div>
                )}

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleStep1Next}
                  disabled={!selectedCinema}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Step 2: Movie, Showtime & Seats */}
        {step === 2 && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Left column: Movie list or Showtime/Seats */}
            <Card className="p-4 flex flex-col">
              {!selectedMovie && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Danh sách phim</p>
                    <Badge variant="secondary">{movies.length} phim</Badge>
                  </div>

                  {loadingMovies && (
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-48 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded mt-2"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingMovies && movies.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                      {movies.map((movie) => (
                        <Card
                          key={movie.id}
                          className="cursor-pointer hover:border-primary transition-all overflow-hidden h-fit"
                          onClick={() => handleMovieSelect(movie)}
                        >
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-2">
                            <div className="font-semibold text-sm line-clamp-1">
                              {movie.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {movie.genre}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {movie.duration} phút • {movie.rating}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3 mt-auto">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedMovie(null);
                        setShowtimes([]);
                        setSelectedShowtime(null);
                        setSeats([]);
                        setSelectedSeats([]);
                        setStep(1);
                      }}
                    >
                      Quay lại bước 1
                    </Button>
                  </div>
                </>
              )}

              {selectedMovie && !selectedShowtime && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Chọn suất chiếu</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedMovie(null);
                        setShowtimes([]);
                        setSelectedShowtime(null);
                        setSeats([]);
                        setSelectedSeats([]);
                      }}
                    >
                      Chọn phim khác
                    </Button>
                  </div>

                  {loadingShowtimes && (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingShowtimes && showtimes.length > 0 && (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide">
                      {showtimes.map((showtime) => {
                        const availableSeats =
                          showtime.totalSeats - showtime.occupiedSeats.length;
                        const isSoldOut = availableSeats === 0;

                        return (
                          <Card
                            key={showtime.id}
                            className={`p-3 ${
                              isSoldOut
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:border-primary"
                            }`}
                            onClick={() =>
                              !isSoldOut && handleShowtimeSelect(showtime)
                            }
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">
                                  {showtime.date} • {showtime.time}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Phòng {showtime.room}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-primary">
                                  {showtime.pricePerSeat.toLocaleString(
                                    "vi-VN"
                                  )}
                                  đ
                                </div>
                                <div
                                  className={`text-xs ${
                                    isSoldOut
                                      ? "text-red-600"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {isSoldOut
                                    ? "Hết vé"
                                    : `${availableSeats} ghế trống`}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {!loadingShowtimes && showtimes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Không có suất chiếu cho phim này tại rạp đã chọn
                    </p>
                  )}
                </>
              )}

              {selectedShowtime && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Chọn ghế</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShowtime(null);
                        setSeats([]);
                        setSelectedSeats([]);
                        // Reload showtimes when going back
                        if (selectedCinema && selectedMovie) {
                          loadShowtimes(selectedCinema.id, selectedMovie.id);
                        }
                      }}
                    >
                      Chọn suất khác
                    </Button>
                  </div>

                  {loadingSeats && (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                          key={i}
                          className="flex gap-2 justify-center animate-pulse"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((j) => (
                            <div
                              key={j}
                              className="w-8 h-8 bg-gray-200 rounded"
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingSeats && seats.length > 0 && (
                    <div className="flex-1 overflow-auto scrollbar-hide">
                      <SeatMap
                        seats={seats}
                        onSelectionChange={handleSeatSelectionChange}
                        maxSeats={10}
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-auto pt-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Reset step 2 data when going back to step 1
                        setSelectedMovie(null);
                        setShowtimes([]);
                        setSelectedShowtime(null);
                        setSeats([]);
                        setSelectedSeats([]);
                        setStep(1);
                      }}
                    >
                      Quay lại bước 1
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleStep2Next}
                      disabled={selectedSeats.length === 0}
                    >
                      Tiếp tục
                    </Button>
                  </div>
                </>
              )}
            </Card>

            {/* Right column: Movie details with trailer & images */}
            <Card className="p-4 flex flex-col space-y-4">
              {selectedMovie && (
                <>
                  {/* Movie Poster & Info */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={selectedMovie.posterUrl}
                        alt={selectedMovie.title}
                        className="w-24 h-36 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {selectedMovie.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedMovie.genre}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedMovie.duration} phút • {selectedMovie.rating}
                        </p>
                        <Button
                          size="sm"
                          className="mt-3"
                          onClick={() => setShowTrailerModal(true)}
                        >
                          <Play size={14} className="mr-1" />
                          Xem trailer
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedMovie.description}
                    </p>
                  </div>

                  {/* Image Gallery */}
                  {selectedMovie.images && selectedMovie.images.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Hình ảnh phim</p>
                      <div className="px-8">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {selectedMovie.images.map((imgUrl, idx) => (
                              <CarouselItem key={idx}>
                                <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                                  <img
                                    src={imgUrl}
                                    alt={`${selectedMovie.title} - Ảnh ${
                                      idx + 1
                                    }`}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                  <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                                    {idx + 1} / {selectedMovie.images.length}
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                    </div>
                  )}
                </>
              )}

              {!selectedMovie && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <Film size={48} className="text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Chọn một phim từ danh sách để xem chi tiết và đặt vé
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Trailer Modal */}
        {showTrailerModal && selectedMovie?.trailerUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden">
              <button
                onClick={handleCloseTrailer}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <X size={20} />
              </button>
              <div className="aspect-video">
                <iframe
                  src={selectedMovie.trailerUrl}
                  title={`${selectedMovie.title} Trailer`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{selectedMovie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMovie.genre}
                  </p>
                </div>
                <Button onClick={handleViewShowtimes}>Xem suất chiếu</Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && selectedCinema && selectedMovie && selectedShowtime && (
          <div className="mt-4 grid gap-4 md:grid-cols-10">
            {/* Left column: Payment confirmation - 7/10 */}
            <Card className="p-4 space-y-3 md:col-span-7 flex flex-col">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Xác nhận & thanh toán</p>
              </div>

              <div className="space-y-2 rounded-xl border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rạp phim</span>
                  <span className="font-semibold">{selectedCinema.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phim</span>
                  <span className="font-semibold">{selectedMovie.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Suất chiếu</span>
                  <span className="font-semibold">
                    {selectedShowtime.date} • {selectedShowtime.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phòng</span>
                  <span className="font-semibold">
                    Phòng {selectedShowtime.room}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ghế đã chọn</span>
                  <span className="font-semibold">
                    {selectedSeats.join(", ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Số lượng vé</span>
                  <span className="font-semibold">
                    {selectedSeats.length} vé
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Giá vé</span>
                  <span className="font-semibold">
                    {selectedShowtime.pricePerSeat.toLocaleString("vi-VN")}đ x{" "}
                    {selectedSeats.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phí</span>
                  <span className="font-semibold">0 ₫</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-primary">
                  <span>Tổng thanh toán</span>
                  <span>{getTotalAmount().toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Tài khoản nguồn
                </p>
                {loadingAccounts && (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                )}

                {!loadingAccounts && accounts.length > 0 && (
                  <div className="space-y-2">
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        type="button"
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          selectedAccountId === account.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedAccountId(account.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono font-semibold">
                              {account.accountNumber}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {account.accountType}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-primary">
                              {account.balance.toLocaleString("vi-VN")} ₫
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!loadingAccounts && accounts.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Chưa có tài khoản thanh toán
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-auto pt-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset step 3 data when going back to step 2
                    setSelectedAccountId("");
                    setStep(2);
                  }}
                >
                  Quay lại bước 2
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePayment}
                  disabled={!selectedAccountId || processing}
                >
                  {processing ? "Đang xử lý..." : "Thanh toán & xem biên lai"}
                </Button>
              </div>
            </Card>

            {/* Right column: Summary & Notes - 3/10 */}
            <Card className="p-4 space-y-4 md:col-span-3">
              <div>
                <p className="text-sm font-semibold mb-3">Thông tin đặt vé</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <img
                      src={selectedMovie.posterUrl}
                      alt={selectedMovie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-2">
                        {selectedMovie.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedMovie.genre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedMovie.duration} phút
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rạp:</span>
                      <span className="font-medium text-right">
                        {selectedCinema.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngày:</span>
                      <span className="font-medium">
                        {selectedShowtime.date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giờ:</span>
                      <span className="font-medium">
                        {selectedShowtime.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phòng:</span>
                      <span className="font-medium">
                        {selectedShowtime.room}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ghế:</span>
                      <span className="font-medium">
                        {selectedSeats.join(", ")}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Tổng cộng:</span>
                    <span className="text-lg font-bold text-primary">
                      {getTotalAmount().toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-3">
                  Cam kết của chúng tôi
                </p>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Check
                      size={14}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />
                    <span>Xác nhận đặt vé ngay lập tức qua email và SMS</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={14}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />
                    <span>Giá vé tốt nhất, không phí ẩn</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={14}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />
                    <span>Hỗ trợ khách hàng 24/7 qua hotline 1900-xxxx</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={14}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />
                    <span>Thanh toán an toàn, bảo mật thông tin</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-3">Lưu ý quan trọng</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• Vui lòng đến rạp trước giờ chiếu 15 phút</p>
                  <p>• Mang theo CCCD/Hộ chiếu để xác nhận</p>
                  <p>• Vé đã mua không thể hoàn trả</p>
                  <p>• Không mang đồ ăn, thức uống từ bên ngoài vào rạp</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
