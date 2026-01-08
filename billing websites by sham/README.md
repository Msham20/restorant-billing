# Restaurant Billing Website

A complete restaurant billing system built with vanilla HTML, CSS, and JavaScript. Features menu management, cart functionality, billing, QR code payment, bill printing, and monthly sales reports.

## Features

- **Menu Display**: View all menu items with images and prices
- **Cart System**: Click items to add to cart, adjust quantities, remove items
- **Billing**: Generate bills, print bills, QR code payment
- **Menu Management**: Full CRUD operations (Create, Read, Update, Delete) for menu items
- **Sales Reports**: Monthly sales reports with item-wise breakdown
- **Data Persistence**: All data stored in browser localStorage

## Setup Instructions

1. **Menu Item Images**: 
   - The website uses open source images from Unsplash by default
   - Images are loaded automatically - no setup required
   - If you want to use your own images, edit the `DEFAULT_MENU` array in `script.js` and replace the image URLs

2. **QR Code Image**:
   - A placeholder QR code is generated automatically
   - To use your own QR code, replace the `src` attribute in the QR code image tag in `index.html`
   - Or update the URL in `script.js` if you want to generate QR codes dynamically

3. **Open the Website**:
   - Simply open `index.html` in a web browser
   - No server or build process required
   - Works offline after initial load (images are cached)

## Default Menu Items

The system comes with these default items:
- Idly: ₹20
- Dosa: ₹30
- Puttu: ₹25
- Vada: ₹15
- Poori: ₹25
- Coffee: ₹15
- Tea: ₹10

## Usage

### Ordering Process
1. Click on any menu item to add it to the cart
2. Adjust quantities using +/- buttons
3. Click "Pay Now" to see the QR code
4. After payment, click "Payment Complete" to print the bill
5. The transaction will be saved for sales reports

### Menu Management
1. Navigate to "Manage Menu" tab
2. Add new items using the form
3. Edit or delete existing items
4. Changes are saved automatically

### Sales Reports
1. Navigate to "Sales Report" tab
2. Select a month to view sales data
3. View total sales, item-wise sales, and transaction details
4. Print the report if needed

## File Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # All styling (fully responsive)
├── script.js           # All JavaScript functionality
├── images/             # Optional: for local images
│   └── README.txt      # Instructions for local images
└── README.md           # This file
```

**Note**: Images are loaded from Unsplash (open source) by default. No local images required!

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid and Flexbox

## Data Storage

All data is stored in browser localStorage:
- Menu items
- Cart items
- Transaction history

**Note**: Data is stored locally in the browser. Clearing browser data will remove all stored information.

## Customization

- **Colors**: Edit the color scheme in `styles.css` (search for `#667eea` to find primary color)
- **Default Menu**: Edit `DEFAULT_MENU` array in `script.js`
- **QR Code**: Replace the QR code image URL in `index.html` with your payment QR code
- **Images**: Update image URLs in `DEFAULT_MENU` array to use your own images

## Mobile Responsive

The website is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (480px - 768px)
- Small Mobile (< 480px)

All features work seamlessly across all device sizes with touch-friendly controls.

## Support

For issues or questions, please check the code comments in the JavaScript file for detailed function descriptions.
