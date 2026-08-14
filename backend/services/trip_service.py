def get_trip_category(budget):
    if budget < 1000: 
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"

def get_travel_season(month):
    """Tentukan kategori musim berdasarkan bulan perjalanan."""
    month = month.strip().lower()
 
    if month == "december":
        return "Peak Season"
    elif month == "june":
        return "Holiday Season"
    else:
        return "Regular Season"
 
 
def calculate_daily_budget(budget, days):
    """Hitung anggaran harian dari total anggaran dibagi jumlah hari."""
    if days <= 0:
        return 0
    return budget / days
 
 
def get_recommended_places(destination):
    """Kembalikan daftar rekomendasi tempat wisata berdasarkan destinasi."""
    place_catalog = {
        "japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "indonesia": ["Borobudur", "Raja Ampat", "Bromo"],
        "france": ["Eiffel Tower", "Louvre Museum", "Versailles"],
        "italy": ["Colosseum", "Venice Canals", "Amalfi Coast"],
    }
 
    key = destination.strip().lower()
    return place_catalog.get(key, ["No recommendation available for this destination"])
 
 
def print_recommended_places(places):
    """Cetak daftar rekomendasi tempat menggunakan loop for."""
    for place in places:
        print(f"- {place}")    