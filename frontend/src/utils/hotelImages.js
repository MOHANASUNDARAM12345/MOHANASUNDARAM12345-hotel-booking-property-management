const localImages = {
  grandPalace: "/images/grand-palace-hotel.jpg",
  greenValley: "/images/green-valley-resort.jpg",
  orchidBoutique: "/images/orchid-boutique-hotel.jpg",
  skylineInn: "/images/skyline-inn.jpg",
  sunsetBeach: "/images/sunset-beach-resort.jpg",
};

export const fallbackImage = localImages.grandPalace;

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

const isUsableImageUrl = (url) => {
  if (typeof url !== "string") return false;
  const value = url.trim();
  if (!value) return false;
  if (/^(https?:)?\/\//i.test(value)) return true;
  if (/^data:image\//i.test(value)) return true;
  if (value.startsWith("/")) return true;
  return false;
};

export const getHotelName = (hotel) =>
  (hotel?.hotelName || hotel?.name || "").trim();

export const getHotelImage = (hotel) => {
  if (!hotel) return fallbackImage;

  if (isUsableImageUrl(hotel.imageUrl)) {
    return hotel.imageUrl.trim();
  }

  const name = getHotelName(hotel).toLowerCase();
  if (name && hotelImageByName[name]) {
    return hotelImageByName[name];
  }

  return fallbackImage;
};

export default getHotelImage;
