/* ============================================ */
/* CRAFT BEER INVENTORY */
/* ============================================ */
/* Stand-in for a real backend. In production this would be fetched */
/* from a CMS or POS integration; the shape (id/name/brewery/style/  */
/* abv/price/status/statusLabel) is what modules/inventory.js renders.*/
/* status drives the badge styling: in-stock | low-stock | out-stock. */
const BEER_INVENTORY = [
    {
        id: 1,
        name: "Pliny the Elder",
        brewery: "Russian River Brewing",
        style: "Double IPA",
        abv: "8.0%",
        price: 9.99,
        status: "in-stock",
        statusLabel: "In Stock"
    },
    {
        id: 2,
        name: "Heady Topper",
        brewery: "The Alchemist",
        style: "Double IPA",
        abv: "8.0%",
        price: 8.50,
        status: "low-stock",
        statusLabel: "Low Stock"
    },
    {
        id: 3,
        name: "Kentucky Breakfast Stout",
        brewery: "Founders Brewing",
        style: "Imperial Stout",
        abv: "12.0%",
        price: 14.99,
        status: "in-stock",
        statusLabel: "In Stock"
    },
    {
        id: 4,
        name: "Trappist Westvleteren 12",
        brewery: "Brouwerij Westvleteren",
        style: "Belgian Quad",
        abv: "10.2%",
        price: 24.99,
        status: "out-stock",
        statusLabel: "Out of Stock"
    },
    {
        id: 5,
        name: "Hazy Little Thing",
        brewery: "Sierra Nevada",
        style: "Hazy IPA",
        abv: "6.7%",
        price: 5.99,
        status: "in-stock",
        statusLabel: "In Stock"
    },
    {
        id: 6,
        name: "La Fin du Monde",
        brewery: "Unibroue",
        style: "Tripel",
        abv: "9.0%",
        price: 7.99,
        status: "in-stock",
        statusLabel: "In Stock"
    },
    {
        id: 7,
        name: "Old Rasputin",
        brewery: "North Coast Brewing",
        style: "Russian Imperial Stout",
        abv: "9.0%",
        price: 6.99,
        status: "low-stock",
        statusLabel: "Low Stock"
    },
    {
        id: 8,
        name: "Two Hearted Ale",
        brewery: "Bell's Brewery",
        style: "American IPA",
        abv: "7.0%",
        price: 5.49,
        status: "in-stock",
        statusLabel: "In Stock"
    },
    {
        id: 9,
        name: "Dark Lord",
        brewery: "Three Floyds",
        style: "Imperial Stout",
        abv: "15.0%",
        price: 29.99,
        status: "out-stock",
        statusLabel: "Out of Stock"
    },
    {
        id: 10,
        name: "Allagash White",
        brewery: "Allagash Brewing",
        style: "Witbier",
        abv: "5.2%",
        price: 5.99,
        status: "in-stock",
        statusLabel: "In Stock"
    }
];
