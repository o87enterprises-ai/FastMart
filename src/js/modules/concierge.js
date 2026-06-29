/* ============================================ */
/* MODULE 5: GEOLOCATION & DIRECTIONS */
/* ============================================ */
/* Shows the user's distance to the store (Haversine) then opens      */
/* Google Maps directions. "Only 2.3 miles away" is a strong CTA.     */
/* Uses STORE_COORDS from data/config.js. */
document.getElementById('directionsBtn').addEventListener('click', () => {
    const distanceDisplay = document.getElementById('distanceDisplay');

    if ('geolocation' in navigator) {
        distanceDisplay.innerHTML = '<span style="color: var(--accent-gold);"><i class="fas fa-spinner fa-spin"></i> Calculating...</span>';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                // Calculate distance using Haversine formula
                const R = 3959; // Earth's radius in miles
                const dLat = (STORE_COORDS.lat - userLat) * Math.PI / 180;
                const dLng = (STORE_COORDS.lng - userLng) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                          Math.cos(userLat * Math.PI / 180) * Math.cos(STORE_COORDS.lat * Math.PI / 180) *
                          Math.sin(dLng/2) * Math.sin(dLng/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distance = R * c;

                distanceDisplay.innerHTML = `
                    <span>You are <span class="dist-value">${distance.toFixed(1)} miles</span> away</span>
                `;

                // Open Google Maps after a brief delay
                setTimeout(() => {
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${STORE_COORDS.lat},${STORE_COORDS.lng}&destination_place_id=Fast+Mart+Creswell`;
                    window.open(mapsUrl, '_blank');
                }, 800);
            },
            (error) => {
                distanceDisplay.innerHTML = '<span style="color: #E57373;"><i class="fas fa-exclamation-triangle"></i> Location access denied</span>';
                // Still open maps
                setTimeout(() => {
                    window.open(`https://www.google.com/maps/search/?api=1&query=Fast+Mart+Creswell+Oregon`, '_blank');
                }, 1000);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        distanceDisplay.innerHTML = '<span>Geolocation not supported by your browser</span>';
        window.open(`https://www.google.com/maps/search/?api=1&query=Fast+Mart+Creswell+Oregon`, '_blank');
    }
});
