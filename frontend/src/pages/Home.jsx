```jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Sparkles,
  Building,
  Calendar,
  ArrowRight,
} from "lucide-react";

const hotelImages = {
  "Green Valley Hotel": "/images/green-valley-resort.jpg",
  "Sunrise Residency Hotel": "/images/grand-palace-hotel.jpg",
  "Royal Palm Suites": "/images/orchid-boutique-hotel.jpg",
  "Blue Sky Lodge": "/images/skyline-inn.jpg",
  "Hill View Retreat": "/images/sunset-beach-resort.jpg",
  "Grand Palace Hotel": "/images/grand-palace-hotel.jpg",
  "Green Valley Resort": "/images/green-valley-resort.jpg",
  "Orchid Boutique Hotel": "/images/orchid-boutique-hotel.jpg",
  "Skyline Inn": "/images/skyline-inn.jpg",
  "Sunset Beach Resort": "/images/sunset-beach-resort.jpg",
};

const fallbackImage = "/images/grand-palace-hotel.jpg";

export const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    api
      .getHotels()
      .then((data) => {
        const hotelList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        if (active) {
          setHotels(hotelList.slice(0, 6));
        }
      })
      .catch((err) => {
        console.error("Unable to load hotels:", err);
        if (active) {
          setHotels([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const city = searchCity.trim();

    if (city) {
      navigate("/hotels?city=" + encodeURIComponent(city));
    } else {
      navigate("/hotels");
    }
  };

  const getHotelImage = (hotel) => {
    const name = hotel.hotelName || hotel.name || "";
    return hotelImages[name] || hotel.imageUrl || fallbackImage;
  };

  return (
    <div className="animate-fade-in">
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          color: "white",
          padding: "5rem 0 6rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.1)",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Sparkles size={16} color="#fbbf24" />
            Next-Gen Capstone Hotel Management System
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: "1.25rem",
            }}
          >
            Book Premium Stays & Manage Properties Effortlessly
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#cbd5e1",
              maxWidth: "680px",
              margin: "0 auto 2.5rem",
            }}
          >
            Discover handpicked hotels, luxury resorts, and boutique
            stays. Complete end-to-end booking, payments, and property
            owner management.
          </p>

          <form
            onSubmit={handleSearch}
            style={{
              background: "white",
              padding: "0.6rem",
              borderRadius: "16px",
              maxWidth: "750px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              color: "#1e293b",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flex: 1,
                minWidth: "200px",
                padding: "0 1rem",
              }}
            >
              <MapPin size={20} color="#4f46e5" />
              <input
                type="text"
                placeholder="Where do you want to stay?"
                value={searchCity}
                onChange={(event) => setSearchCity(event.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  padding: "0.8rem 0",
                  fontSize: "0.95rem",
                  color: "#1e293b",
                  background: "transparent",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: "#4f46e5",
                color: "white",
                padding: "0.85rem 1.25rem",
                border: "none",
                borderRadius: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Search size={18} />
              Search Hotels
            </button>
          </form>
        </div>
      </div>

      <div
        className="container"
        style={{
          marginTop: "-2rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              icon: <Building size={24} color="#4f46e5" />,
              title: "Property Management",
              desc: "Manage properties, rooms, staff and pricing.",
            },
            {
              icon: <Calendar size={24} color="#0ea5e9" />,
              title: "Real-time Booking",
              desc: "Easy booking management for your next stay.",
            },
            {
              icon: <ShieldCheck size={24} color="#10b981" />,
              title: "Secure Payments",
              desc: "A secure and convenient booking experience.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                border: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "0.75rem",
                  borderRadius: "12px",
                }}
              >
                {feature.icon}
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    marginBottom: "0.25rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section
        className="container"
        style={{ padding: "5rem 1.5rem 3rem" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Featured Stays & Hotels
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.95rem",
                marginTop: "0.25rem",
              }}
            >
              Discover a stay for your next trip.
            </p>
          </div>

          <Link
            to="/hotels"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              color: "#4f46e5",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            View All Hotels <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#64748b",
            }}
          >
            Loading featured hotels...
          </div>
        ) : hotels.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <Building
              size={48}
              color="#94a3b8"
              style={{ marginBottom: "1rem" }}
            />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
              No Hotels Found
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                marginTop: "0.25rem",
              }}
            >
              Register a hotel to display it here.
            </p>
            <Link
              to="/login"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                background: "#4f46e5",
                color: "white",
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Owner Login
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {hotels.map((hotel, index) => (
              <article
                key={hotel.hotelId ?? hotel.id ?? index}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    height: "200px",
                    background: "#e2e8f0",
                    position: "relative",
                  }}
                >
                  <img
                    src={getHotelImage(hotel)}
                    alt={hotel.hotelName || hotel.name || "Hotel"}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "rgba(15,23,42,0.8)",
                      color: "#fbbf24",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Star size={14} fill="#fbbf24" />
                    {hotel.rating ?? 4.5}
                  </div>
                </div>

                <div style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#4f46e5",
                      textTransform: "uppercase",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {hotel.category || hotel.hotelType || "Hotel"}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {hotel.hotelName || hotel.name || "Hotel"}
                  </h3>

                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: "#64748b",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <MapPin size={14} />
                    {hotel.location || hotel.city || "City Center"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: "0.75rem",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "1.15rem",
                          fontWeight: 800,
                          color: "#0f172a",
                        }}
                      >
                        ₹
                        {Number(
                          hotel.pricePerNight ?? hotel.price ?? 2500
                        ).toLocaleString("en-IN")}
                      </span>
                      <span
                        style={{ fontSize: "0.8rem", color: "#64748b" }}
                      >
                        {" "}/ night
                      </span>
                    </div>

                    <Link
                      to={
                        "/hotels/" +
                        (hotel.hotelId ?? hotel.id ?? "")
                      }
                      style={{
                        background: "#eef2ff",
                        color: "#4f46e5",
                        padding: "0.45rem 0.9rem",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
```