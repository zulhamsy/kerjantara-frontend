export async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: {
        'Accept-Language': 'id'
      }
    });
    const data = await response.json();
    return data.display_name || "Alamat tidak ditemukan";
  } catch (err) {
    console.error("Geocoding error:", err);
    return "";
  }
}
