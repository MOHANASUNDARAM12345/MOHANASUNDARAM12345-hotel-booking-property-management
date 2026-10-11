const localImages = {
  grandPalace: "/images/grand-palace-hotel.jpg",
  greenValley: "/images/green-valley-resort.jpg",
  orchidBoutique: "/images/orchid-boutique-hotel.jpg",
  skylineInn: "/images/skyline-inn.jpg",
  sunsetBeach: "/images/sunset-beach-resort.jpg",
};

export const fallbackImage = localImages.grandPalace;

// Curated local images for the seeded hotels. These are reliable, ship with the
// static build and never depend on third-party image hosts. Matching by name
// keeps images stable even when the backend image_url is missing or a generic
// placeholder URL.
const hotelImageByName = {
  "murugan residency hotel": localImages.grandPalace,
  "mohan grand hotel": localImages.greenValley,
  "naveen lodge hotel": localImages.skylineInn,
  "vadivel palace hotel": localImages.orchidBoutique,
  "palaniyammal stay hotel": localImages.sunsetBeach,
  "green valley hotel": localImages.greenValley,
  "green valley resort": localImages.greenValley,
  "sunrise residency hotel": localImages.grandPalace,
  "royal palm suites": localImages.orchidBoutique,
  "blue sky lodge": localImages.skylineInn,
  "hill view retreat": localImages.sunsetBeach,
  "grand palace hotel": localImages.grandPalace,
  "orchid boutique hotel": localImages.orchidBoutique,
  "skyline inn": localImages.skylineInn,
  "sunset beach resort": localImages.sunsetBeach,
};

// Seeded hotel IDs -> local image, so images still resolve if names change.
const hotelImageById = {
  1: localImages.greenValley,
  2: localImages.grandPalace,
  3: localImages.grandPalace,
  4: localImages.orchidBoutique,
  5: localImages.skylineInn,
  6: localImages.sunsetBeach,
};

const isUsableImageUrl = (url) => {
  if (typeof url !== "string") return false;
  const value = url.trim();
  if (!value) return false;
  // Absolute http(s) URL
  if (/^https?:\/\//i.test(value)) return true;
  // Protocol-relative URL
  if (/^\/\//.test(value)) return true;
  // Inline data URL
  if (/^data:image\//i.test(value)) return true;
  // Root-relative path served from the frontend public directory
  if (value.startsWith("/")) return true;
  return false;
};

export const getHotelName = (hotel) =>
  (hotel?.hotelName || hotel?.name || "").trim();

export const getHotelId = (hotel) =>
  hotel?.hotelId ?? hotel?.id ?? null;

export const getHotelImage = (hotel) => {
  if (!hotel) return fallbackImage;

  const name = getHotelName(hotel).toLowerCase();
  if (name && hotelImageByName[name]) {
    return hotelImageByName[name];
  }

  if (isUsableImageUrl(hotel.imageUrl)) {
    return hotel.imageUrl.trim();
  }

  const id = getHotelId(hotel);
  if (id != null && hotelImageById[id]) {
    return hotelImageById[id];
  }

  return fallbackImage;
};

export default getHotelImage;
