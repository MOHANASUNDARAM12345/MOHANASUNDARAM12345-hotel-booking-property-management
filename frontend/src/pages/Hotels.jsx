import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Hotel as HotelIcon,
} from "lucide-react";
import { api } from "../services/api";
import { getHotelImage, fallbackImage } from "../utils/hotelImages";
import "./Hotels.css";

const categories = ["All", "Luxury", "Premium", "Budget", "Resort"];

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchHotels() {
      try {
        setLoading(true);
        setError("");

        const response = await api.getHotels();

        const hotelData = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        if (active) {
          setHotels(hotelData);
        }
      } catch (err) {
        console.error("Failed to load hotels:", err);
        if (active) {
          setError("Unable to load hotels. Check whether the backend is running.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchHotels();

    return () => {
      active = false;
    };
  }, []);

  const getHotelId = (hotel) =>
    hotel.hotelId ?? hotel.id ?? hotel.propertyId;

  const getHotelName = (hotel) =>
    hotel.hotelName || hotel.name || "Hotel";

  const filteredHotels = hotels.filter((hotel) => {
    const name = getHotelName(hotel).toLowerCase();
    const location = String(
      hotel.location || hotel.city || ""
    ).toLowerCase();
    const category = String(
      hotel.category || hotel.hotelType || ""
    ).toLowerCase();

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      category === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) =>
    Number(price ?? 0).toLocaleString("en-IN");

  if (loading) {
    return (
      <main className="hotels-page">
        <div className="hotels-message">
          <div className="hotels-spinner" />
          <p>Loading hotels...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="hotels-page">
        <div className="hotels-message">
          <h2>Unable to load hotels</h2>
          <p>{error}</p>
          <button
            className="hotels-reset-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="hotels-page">
      <header className="hotels-header">
        <span className="hotels-eyebrow">Find your perfect stay</span>
        <h1 className="hotels-title">Explore Our Hotels</h1>
        <p className="hotels-description">
          Discover comfortable stays, beautiful destinations, and
          places designed to make your journey memorable.
        </p>
      </header>

      <section className="hotels-toolbar">
        <label className="hotels-search">
          <Search size={20} />
          <input
            type="search"
            placeholder="Search hotel or location..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <div className="hotels-categories">
          <SlidersHorizontal size={18} />
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category
                  ? "hotels-category active"
                  : "hotels-category"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <p className="hotels-count">
        Showing {filteredHotels.length} of {hotels.length} hotels
      </p>

      <section className="hotels-grid">
        {filteredHotels.length === 0 ? (
          <div className="hotels-empty">
            <HotelIcon size={38} />
            <h3>No hotels found</h3>
            <p>Try a different search term or category.</p>
          </div>
        ) : (
          filteredHotels.map((hotel, index) => {
            const hotelId = getHotelId(hotel);
            const hotelName = getHotelName(hotel);
            const location =
              hotel.location || hotel.city || "Location unavailable";
            const category =
              hotel.category || hotel.hotelType || "Hotel";
            const price =
              hotel.pricePerNight ??
              hotel.price ??
              hotel.basePrice ??
              0;
            const rating = hotel.rating ?? 4.5;

            return (
              <article
                className="hotel-card"
                key={hotelId ?? index}
              >
                <div className="hotel-image-wrap">
                  <img
                    className="hotel-image"
                    src={getHotelImage(hotel)}
                    alt={hotelName}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                  <span className="hotel-category-badge">
                    {category}
                  </span>
                </div>

                <div className="hotel-content">
                  <h2 className="hotel-name">{hotelName}</h2>

                  <div className="hotel-location">
                    <MapPin size={16} />
                    <span>{location}</span>
                  </div>

                  <div className="hotel-rating">
                    <Star size={16} fill="currentColor" />
                    <strong>{rating}</strong>
                    <span className="hotel-rating-label">Rating</span>
                  </div>

                  <div className="hotel-card-footer">
                    <div>
                      <span className="hotel-price-label">
                        Starting from
                      </span>
                      <div className="hotel-price">
                        ₹{formatPrice(price)}
                        <span className="hotel-price-unit">
                          {" "}/ night
                        </span>
                      </div>
                    </div>

                    {hotelId != null ? (
                      <Link
                        className="hotel-view-link"
                        to={"/hotels/" + hotelId}
                      >
                        View Details <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <span className="hotel-price-unit">
                        Details unavailable
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

export default Hotels;