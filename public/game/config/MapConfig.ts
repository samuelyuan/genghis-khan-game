export const MAP_CONFIG = {
  // Colors
  COLORS: {
    OCEAN: '#202020',
    NEUTRAL: '#CCCCCC',
    CONQUERED: '#FF6600',
    BORDER: '#000000'
  },
  
  // Country-specific colors
  COUNTRY_COLORS: {
    "Albania": "#FFCC00",
    "Afghanistan": "#99CC66",
    "Austria": "#336F50",
    "Bangladesh": "#FD2D95",
    "Belarus": "#999900",
    "Bhutan": "#FF99FF",
    "Bosnia": "#66CC00",
    "Bulgaria": "#6699CC",
    "Cambodia": "#FFCC33",
    "China": "#C18787",
    "Croatia": "#33CCFF",
    "Czech": "#FF99FF",
    "France": "#FFCC00",
    "Germany": "#666600",
    "Greece": "#BA4B01",
    "Hungary": "#FF9999",
    "India": "#669900",
    "Iran": "#FF9966",
    "Iraq": "#669900",
    "Israel": "#FF9900",
    "Italy": "#66CC00",
    "Japan": "#66CC00",
    "Jordan": "#66FF00",
    "Kazakhstan": "#66CC00",
    "Kirghizstan": "#E4FD02",
    "Korea": "#FFCC66",
    "Kuwait": "#00CC99",
    "Laos": "#999966",
    "Latvia": "#99CC99",
    "Lithuania": "#66CC00",
    "Macedonia": "#FF66FF",
    "Mongolia": "#FF6600",
    "Moldavia": "#FB7BD6",
    "Montenegro": "#999900",
    "Myanmar": "#CCCC99",
    "Nepal": "#FFCC66",
    "Oman": "#999900",
    "Pakistan": "#FFCC00",
    "Poland": "#99CC99",
    "Romania": "#FF9966",
    "Russia": "#006666",
    "Saudi Arabia": "#CC9999",
    "Serbia": "#996600",
    "Slovakia": "#33CC00",
    "Slovenia": "#FF66FF",
    "Syria": "#FE6785",
    "Swiss": "#FF9999",
    "Tajikistan": "#FF99FF",
    "Thailand": "#FF99CC",
    "Turkey": "#78BB77",
    "Turkmenistan": "#996600",
    "Ukraine": "#FFCC66",
    "United Arab Emirates": "#FF9900",
    "Uzbekistan": "#009999",
    "Vietnam": "#FF9966",
    "Yemen": "#996600"
  },
  
  // Neutral countries (not in game scope)
  NEUTRAL_COUNTRIES: [
    "Norway", "Sweden", "Finland", "Estonia", "Denmark",
    "Belgium", "United Kingdom", "Ireland", "Spain", "Portugal", "Iceland", "Luxembourg", "Netherlands",
    "Lebanon", "Armenia", "Georgia", "Azerbaijan", "Qatar",
    "Sri Lanka", "Indonesia", "Malaysia", "Papua New Guinea", "Philippines", "Taiwan", "Brunei"
  ],
  
  // Markers
  MARKERS: [
    { coords: [300, 95], name: 'Genghis Khan' }
  ],
  
  // Map data identifier
  MAP_DATA: 'eurasia_map',
  
  // Styling
  STYLES: {
    REGION: {
      INITIAL: {
        fill: "white",
        "fill-opacity": 1
      }
    },
    MARKER: {
      INITIAL: {
        fill: '#F8E23B',
        stroke: '#383f47'
      }
    }
  }
} as const;
