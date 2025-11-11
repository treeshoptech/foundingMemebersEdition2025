/**
 * Comprehensive Equipment Categories, Types, and Attachments for Tree Care Industry
 * This provides standardized categorization for detailed inventory management
 */

// Main Equipment Categories - Organized by importance/cost (heavy machinery first)
export const EQUIPMENT_CATEGORIES = {
  TRUCKS: "Trucks & Vehicles",
  AERIAL_EQUIPMENT: "Aerial Equipment (Bucket Trucks, Lifts)",
  CHIPPERS: "Chippers & Grinders",
  STUMP_GRINDERS: "Stump Grinders",
  GROUND_EQUIPMENT: "Heavy Ground Equipment (Skid Steers, Excavators, Tractors)",
  SKID_STEER_ATTACHMENTS: "Skid Steer Attachments (Mulchers, Grapples, Buckets, Forks)",
  EXCAVATOR_ATTACHMENTS: "Excavator Attachments (Mulchers, Grapples, Buckets, Thumbs)",
  TRACTOR_ATTACHMENTS: "Tractor Attachments (Implements, PTOs, 3-Point Hitch)",
  TRUCK_BODIES_ATTACHMENTS: "Truck Bodies & Major Attachments (Chip Boxes, Dumps, Cranes, Grapples)",
  TRAILERS: "Trailers",
  SAWS: "Saws & Cutting Tools",
  CLIMBING_GEAR: "Climbing Gear",
  RIGGING_EQUIPMENT: "Rigging Equipment",
  SAFETY_EQUIPMENT: "Safety Equipment",
  DIAGNOSTIC_TOOLS: "Diagnostic Tools",
  SPRAY_EQUIPMENT: "Spray Equipment",
} as const

// Equipment Types by Category
export const EQUIPMENT_TYPES = {
  // Aerial Equipment Types
  AERIAL_EQUIPMENT: [
    "Bucket Truck - Over Center",
    "Bucket Truck - Rear Mount",
    "Bucket Truck - Articulating",
    "Bucket Truck - Material Handling",
    "Spider Lift",
    "Towable Lift",
    "Track Lift",
    "Boom Lift - Straight",
    "Boom Lift - Articulating",
  ],

  // Chipper Types
  CHIPPERS: [
    "Disc Chipper - 6 inch",
    "Disc Chipper - 9 inch",
    "Disc Chipper - 12 inch",
    "Disc Chipper - 15 inch",
    "Disc Chipper - 18 inch+",
    "Drum Chipper - 6 inch",
    "Drum Chipper - 9 inch",
    "Drum Chipper - 12 inch",
    "Drum Chipper - 15 inch+",
    "Tub Grinder",
    "Horizontal Grinder",
    "Track Chipper",
  ],

  // Stump Grinder Types
  STUMP_GRINDERS: [
    "Walk-Behind Grinder - Small (up to 13HP)",
    "Walk-Behind Grinder - Medium (14-25HP)",
    "Walk-Behind Grinder - Large (26HP+)",
    "Tow-Behind Grinder",
    "Self-Propelled Grinder",
    "Track Grinder - Small",
    "Track Grinder - Large",
    "Skid Steer Attachment Grinder",
  ],

  // Truck Types
  TRUCKS: [
    "Pickup Truck - 1/2 Ton",
    "Pickup Truck - 3/4 Ton",
    "Pickup Truck - 1 Ton",
    "Dump Truck - Single Axle",
    "Dump Truck - Tandem Axle",
    "Chip Truck - Single Axle",
    "Chip Truck - Tandem Axle",
    "Flatbed Truck",
    "Service Truck",
    "Crew Cab Truck",
    "Grapple Truck",
    "Log Truck",
  ],

  // Trailer Types
  TRAILERS: [
    "Equipment Trailer - Single Axle",
    "Equipment Trailer - Tandem Axle",
    "Equipment Trailer - Gooseneck",
    "Chip Trailer",
    "Log Trailer",
    "Dump Trailer - 10ft",
    "Dump Trailer - 12ft",
    "Dump Trailer - 14ft",
    "Dump Trailer - 16ft+",
    "Utility Trailer",
  ],

  // Saws & Cutting Tools
  SAWS: [
    "Chainsaw - Battery Powered",
    "Chainsaw - Gas (Under 40cc)",
    "Chainsaw - Gas (40-50cc)",
    "Chainsaw - Gas (50-60cc)",
    "Chainsaw - Gas (60-70cc)",
    "Chainsaw - Gas (70cc+)",
    "Pole Saw - Battery Powered",
    "Pole Saw - Gas Powered",
    "Hedge Trimmer - Battery",
    "Hedge Trimmer - Gas",
    "Pruning Saw - Hand",
    "Folding Saw - Hand",
    "Reciprocating Saw - Battery",
  ],

  // Climbing Gear
  CLIMBING_GEAR: [
    "Climbing Saddle - Basic",
    "Climbing Saddle - Professional",
    "Climbing Rope - Static",
    "Climbing Rope - Dynamic",
    "Throw Line & Weight",
    "Lanyard - Wire Core",
    "Lanyard - Rope",
    "Ascender - Mechanical",
    "Descender - Figure 8",
    "Descender - Rope Wrench",
    "Carabiner Set",
    "Cambium Saver",
    "Friction Saver",
    "Knee Ascender System",
    "Foot Ascender System",
    "Climbing Spurs/Gaffs",
  ],

  // Rigging Equipment
  RIGGING_EQUIPMENT: [
    "Rigging Rope - 1/2 inch",
    "Rigging Rope - 5/8 inch",
    "Rigging Rope - 3/4 inch",
    "Rigging Rope - 7/8 inch",
    "Block & Tackle - Single",
    "Block & Tackle - Double",
    "Block & Tackle - Triple",
    "Portawrap",
    "GRCS (Good Rigging Control System)",
    "Hobbs Lowering Device",
    "Rigging Slings - Various Sizes",
    "Winch - Hand Operated",
    "Winch - Electric",
    "Come-Along",
    "Rope Puller",
  ],

  // Ground Equipment (Base Machines Only)
  GROUND_EQUIPMENT: [
    "Skid Steer Loader - Wheeled",
    "Skid Steer Loader - Track (CTL)",
    "Mini Excavator - Under 5,000 lbs",
    "Mini Excavator - 5,000-10,000 lbs",
    "Midi Excavator - 10,000-20,000 lbs",
    "Standard Excavator - 20,000+ lbs",
    "Compact Track Loader (CTL)",
    "Tractor - Compact (Under 40 HP)",
    "Tractor - Utility (40-80 HP)",
    "Tractor - Agricultural (80+ HP)",
    "Walk-Behind Tractor",
    "ATV/UTV",
    "Telehandler/Reach Forklift",
    "Wheel Loader",
  ],

  // Skid Steer Attachments (Major Equipment)
  SKID_STEER_ATTACHMENTS: [
    "Forestry Mulcher - Standard Flow",
    "Forestry Mulcher - High Flow",
    "Brush Cutter - Standard Duty",
    "Brush Cutter - Heavy Duty",
    "Stump Grinder Attachment",
    "Grapple Bucket - Standard",
    "Grapple Bucket - Root/Rock",
    "Standard Bucket - 60 inch",
    "Standard Bucket - 72 inch",
    "Standard Bucket - 84 inch",
    "High Capacity Bucket",
    "4-in-1 Bucket",
    "Pallet Forks - Standard",
    "Pallet Forks - Heavy Duty",
    "Bale Spear",
    "Tree Shear",
    "Log Grapple",
    "Rock Grapple",
    "Auger - 6 inch",
    "Auger - 9 inch",
    "Auger - 12 inch",
    "Auger - 18 inch+",
    "Trencher - 36 inch",
    "Trencher - 48 inch",
    "Harley Rake/Landscape Rake",
    "Tiller/Soil Conditioner",
    "Sweeper/Broom - Angle",
    "Sweeper/Broom - Pickup",
    "Snow Pusher",
    "Snow Blower",
    "Concrete Breaker",
    "Planer/Milling Attachment",
  ],

  // Excavator Attachments (Major Equipment)
  EXCAVATOR_ATTACHMENTS: [
    "Forestry Mulcher Head",
    "Brush Cutter Head",
    "Standard Digging Bucket - 12 inch",
    "Standard Digging Bucket - 18 inch",
    "Standard Digging Bucket - 24 inch",
    "Standard Digging Bucket - 30 inch",
    "Standard Digging Bucket - 36 inch+",
    "Grading Bucket - 48 inch",
    "Grading Bucket - 60 inch",
    "Grading Bucket - 72 inch",
    "Hydraulic Thumb - Fixed",
    "Hydraulic Thumb - Rotating",
    "Grapple - Fixed",
    "Grapple - Rotating",
    "Log Grapple",
    "Rock Grapple",
    "Root Rake",
    "Ripper Tooth - Single Shank",
    "Ripper Tooth - Multi Shank",
    "Auger Drive Unit",
    "Auger Bit - Various Sizes",
    "Hydraulic Breaker/Hammer - Small",
    "Hydraulic Breaker/Hammer - Medium",
    "Hydraulic Breaker/Hammer - Large",
    "Compaction Wheel",
    "Plate Compactor",
    "Quick Coupler - Manual",
    "Quick Coupler - Hydraulic",
  ],

  // Tractor Attachments (Implements)
  TRACTOR_ATTACHMENTS: [
    "Rotary Cutter/Bush Hog - 4 ft",
    "Rotary Cutter/Bush Hog - 5 ft",
    "Rotary Cutter/Bush Hog - 6 ft",
    "Rotary Cutter/Bush Hog - 7 ft+",
    "Finish Mower - 60 inch",
    "Finish Mower - 72 inch",
    "Flail Mower - 4 ft",
    "Flail Mower - 5 ft",
    "Flail Mower - 6 ft",
    "Box Blade - 5 ft",
    "Box Blade - 6 ft",
    "Box Blade - 7 ft",
    "Landscape Rake - 5 ft",
    "Landscape Rake - 6 ft",
    "Disc Harrow",
    "Tiller - 4 ft",
    "Tiller - 5 ft",
    "Tiller - 6 ft",
    "Post Hole Digger - PTO Driven",
    "Auger - 3-Point Hitch Mount",
    "Front End Loader",
    "Backhoe Attachment",
    "Bale Spear - 3-Point",
    "Pallet Forks - 3-Point",
    "Wood Chipper - PTO Driven",
    "Broadcast Spreader",
    "Sprayer - 3-Point Mount",
    "Seeder",
    "Cultipacker",
  ],

  // Truck Bodies & Major Attachments
  TRUCK_BODIES_ATTACHMENTS: [
    "Chip Box - 10 Cubic Yard",
    "Chip Box - 12 Cubic Yard",
    "Chip Box - 14 Cubic Yard",
    "Chip Box - 16 Cubic Yard",
    "Chip Box - 18 Cubic Yard+",
    "Dump Body - 9 ft",
    "Dump Body - 10 ft",
    "Dump Body - 11 ft",
    "Dump Body - 12 ft",
    "Dump Body - 14 ft+",
    "Flatbed Body - 8 ft",
    "Flatbed Body - 9 ft",
    "Flatbed Body - 11 ft",
    "Flatbed Body - 12 ft",
    "Service Body - Standard",
    "Service Body - Crane Ready",
    "Grapple Loader - Knuckle Boom (Front Mount)",
    "Grapple Loader - Knuckle Boom (Rear Mount)",
    "Grapple Loader - Articulating",
    "Crane - Knuckle Boom (Small - 10,000 lb capacity)",
    "Crane - Knuckle Boom (Medium - 20,000 lb capacity)",
    "Crane - Knuckle Boom (Large - 30,000+ lb capacity)",
    "Crane - Articulating Boom",
    "Grapple Truck System - Complete",
    "Log Loader",
    "Winch - PTO Driven (8,000 lb)",
    "Winch - PTO Driven (12,000 lb)",
    "Winch - PTO Driven (15,000+ lb)",
    "Winch - Hydraulic (10,000 lb)",
    "Winch - Hydraulic (15,000 lb)",
    "Winch - Hydraulic (20,000+ lb)",
    "Liftgate - Tuckunder",
    "Liftgate - Rail",
    "Stake Sides - 24 inch",
    "Stake Sides - 36 inch",
    "Stake Sides - 48 inch",
  ],

  // Safety Equipment
  SAFETY_EQUIPMENT: [
    "Helmet with Face Shield",
    "Helmet - Climbing Style",
    "Safety Glasses",
    "Hearing Protection - Earplugs",
    "Hearing Protection - Earmuffs",
    "Chainsaw Chaps",
    "Chainsaw Pants",
    "Work Gloves - General",
    "Work Gloves - Chainsaw Resistant",
    "First Aid Kit - Basic",
    "First Aid Kit - Professional",
    "Traffic Cones",
    "Safety Vest - Class 2",
    "Safety Vest - Class 3",
    "Warning Signs",
    "Barricade Tape",
  ],

  // Diagnostic Tools
  DIAGNOSTIC_TOOLS: [
    "Resistograph",
    "Increment Borer",
    "Soil pH Tester",
    "Moisture Meter",
    "Laser Measuring Device",
    "Clinometer",
    "Diameter Tape",
    "GPS Device",
    "Tree Height Meter",
    "Root Collar Excavation Tool (Air Spade)",
  ],

  // Spray Equipment
  SPRAY_EQUIPMENT: [
    "Backpack Sprayer - Manual",
    "Backpack Sprayer - Battery",
    "Truck-Mounted Sprayer",
    "ATV-Mounted Sprayer",
    "Injection System - Trunk",
    "Injection System - Soil",
    "Spray Gun - Professional",
    "Hose Reel System",
  ],
} as const

// Attachments by Equipment Category
export const EQUIPMENT_ATTACHMENTS = {
  // Aerial Equipment Attachments
  AERIAL_EQUIPMENT: [
    "Chainsaw Holder",
    "Tool Bag/Tray",
    "Material Handling Jib",
    "Auxiliary Hydraulic Control",
    "LED Work Lights",
    "Ladder Rack",
    "Outrigger Pads",
  ],

  // Chipper Attachments
  CHIPPERS: [
    "Winch - 3000 lb",
    "Winch - 6000 lb",
    "Winch - 9000 lb+",
    "Auto-Feed System",
    "Discharge Chute Extension",
    "Feed Roller - Extra Set",
    "Feed Wheel - Extra Set",
    "Knives - Replacement Set",
    "Anvil - Replacement",
    "Deflector Shield",
    "Tarp System",
    "Brush Basket",
  ],

  // Stump Grinder Attachments
  STUMP_GRINDERS: [
    "Cutting Teeth - Carbide (Set)",
    "Cutting Teeth - Green (Set)",
    "Cutting Teeth - Shark (Set)",
    "Cutting Wheel - Replacement",
    "Remote Control System",
    "Debris Shield",
    "Trailer Hitch Kit",
  ],

  // Truck Attachments
  TRUCKS: [
    "Dump Body",
    "Chip Box - 10 yard",
    "Chip Box - 12 yard",
    "Chip Box - 14 yard",
    "Chip Box - 16 yard+",
    "Grapple Loader - Front Mount",
    "Grapple Loader - Rear Mount",
    "Crane - Knuckle Boom",
    "Crane - Articulating",
    "Winch - PTO Driven",
    "Tool Boxes - Underbody",
    "Stake Sides",
    "Tarp System - Roll",
    "Tarp System - Mesh",
    "Trailer Hitch - Receiver",
    "Trailer Hitch - Gooseneck",
    "Ladder Rack",
    "Headache Rack",
    "Running Boards",
    "Mud Flaps",
  ],

  // Trailer Attachments
  TRAILERS: [
    "Ramp System - Fixed",
    "Ramp System - Fold Down",
    "Ramp System - Slide Out",
    "E-Track Rails",
    "D-Ring Tie Downs",
    "Tool Box - Front Mount",
    "Tool Box - Side Mount",
    "Spare Tire Mount",
    "Wheel Chocks",
    "Safety Chain Set",
    "Breakaway System",
    "LED Light Kit",
    "Fender Set",
    "Jack Stand",
  ],

  // Saw Attachments
  SAWS: [
    "Bar & Chain - Various Sizes",
    "Spare Chain - Loop",
    "Chain Sharpener - File Kit",
    "Chain Sharpener - Electric",
    "Scabbard/Bar Cover",
    "Carrying Case",
    "Extra Battery Pack",
    "Rapid Charger",
    "Bar Oil Bottle",
    "Wedge Set",
    "Felling Dogs",
  ],

  // Climbing Gear Attachments
  CLIMBING_GEAR: [
    "Gear Loops",
    "Gear Sling",
    "Chainsaw Holder/Scabbard",
    "Tool Lanyard Set",
    "Rope Bag",
    "Throw Line Storage Bag",
    "Water Bottle Holder",
    "Radio Holder",
    "First Aid Pouch",
  ],

  // Rigging Equipment Attachments
  RIGGING_EQUIPMENT: [
    "Pulley - Single Sheave",
    "Pulley - Double Sheave",
    "Pulley - Triple Sheave",
    "Swivel Eye",
    "Rigging Thimbles",
    "Rope Snaps",
    "Tree Saver Straps",
    "Anchor Slings",
    "Rope Storage Bag",
  ],

  // Ground Equipment Attachments
  GROUND_EQUIPMENT: [
    "Bucket - General Purpose",
    "Bucket - Grapple",
    "Forks - Pallet",
    "Stump Grinder Attachment",
    "Auger - Various Sizes",
    "Trencher",
    "Brush Cutter",
    "Mulcher Head",
    "Root Rake",
    "Tiller",
  ],

  // Safety Equipment Attachments
  SAFETY_EQUIPMENT: [
    "Hard Hat Accessories",
    "Hi-Vis Suspenders",
    "Badge Holder",
    "ID Card Holder",
  ],

  // Diagnostic Tools Attachments
  DIAGNOSTIC_TOOLS: [
    "Carrying Case",
    "Calibration Kit",
    "Probe Extensions",
    "Battery Charger",
    "Tripod Mount",
  ],

  // Spray Equipment Attachments
  SPRAY_EQUIPMENT: [
    "Nozzle Set - Various Patterns",
    "Extension Wand",
    "Pressure Gauge",
    "Filter Set",
    "Hose - Extension",
    "Tank - Additional Capacity",
    "Calibration Kit",
    "Safety Equipment Kit",
  ],
} as const

// Equipment Status Options
export const EQUIPMENT_STATUS = {
  ACTIVE: "Active",
  IN_MAINTENANCE: "In Maintenance",
  OUT_OF_SERVICE: "Out of Service",
  RETIRED: "Retired",
  ON_LOAN: "On Loan",
} as const

// Equipment Condition Options
export const EQUIPMENT_CONDITION = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
  NEEDS_REPAIR: "Needs Repair",
} as const

// Fuel Types
export const FUEL_TYPES = {
  GASOLINE: "Gasoline",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  BATTERY: "Battery",
  PROPANE: "Propane",
  HYBRID: "Hybrid",
  NONE: "None",
} as const

// Helper functions to get arrays
export const getCategories = () => Object.values(EQUIPMENT_CATEGORIES)
export const getTypes = (category: keyof typeof EQUIPMENT_TYPES) => EQUIPMENT_TYPES[category] || []
export const getAttachments = (category: keyof typeof EQUIPMENT_ATTACHMENTS) => EQUIPMENT_ATTACHMENTS[category] || []
export const getStatuses = () => Object.values(EQUIPMENT_STATUS)
export const getConditions = () => Object.values(EQUIPMENT_CONDITION)
export const getFuelTypes = () => Object.values(FUEL_TYPES)
