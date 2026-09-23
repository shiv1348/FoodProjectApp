const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const Restaurant = require("../models/restaurant");
const Menu = require("../models/Menu");
const FoodItem = require("../models/FoodItem");

const restaurantData = [
  {
    name: "Haldiram's",
    categories: [
      {
        category: "Snacks & Chaat",
        items: [
          {
            name: "Pani Puri (8 Pcs)",
            price: 80,
            description: "Crispy puris filled with spicy mint water, sweet tamarind chutney, and boiled potato-chana mash.",
            ratings: 4.6,
            stock: 50,
            images: [{ public_id: "haldiram_panipuri", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Raj Kachori",
            price: 140,
            description: "Crispy large kachori stuffed with diced potatoes, sprouts, sweet curd, tangy chutneys, and nylon sev.",
            ratings: 4.8,
            stock: 35,
            images: [{ public_id: "haldiram_rajkachori", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Chole Bhature",
            price: 180,
            description: "Two fluffy bhaturas served with robust Punjabi spiced chickpeas, pickled onions, and green chilies.",
            ratings: 4.7,
            stock: 40,
            images: [{ public_id: "haldiram_cholebhature", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "South Indian",
        items: [
          {
            name: "Masala Dosa",
            price: 120,
            description: "Crispy golden crepe made from fermented rice-lentil batter stuffed with fragrant spiced potato masala.",
            ratings: 4.5,
            stock: 45,
            images: [{ public_id: "haldiram_dosa", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Idli Sambar (2 Pcs)",
            price: 90,
            description: "Steamed fluffy rice cakes served with aromatic vegetable sambar and fresh coconut chutney.",
            ratings: 4.4,
            stock: 60,
            images: [{ public_id: "haldiram_idli", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "North Indian Main Course",
        items: [
          {
            name: "Paneer Butter Masala",
            price: 240,
            description: "Fresh cottage cheese cubes cooked in a rich, buttery tomato sauce infused with fenugreek leaves.",
            ratings: 4.7,
            stock: 30,
            images: [{ public_id: "haldiram_paneer", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Veg Fried Rice",
            price: 160,
            description: "Wok-tossed basmati rice with crunchy carrots, cabbage, spring onions, and light soy sauce.",
            ratings: 4.3,
            stock: 40,
            images: [{ public_id: "haldiram_friedrice", url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "Beverages & Sweets",
        items: [
          {
            name: "Gulab Jamun (2 Pcs)",
            price: 70,
            description: "Warm soft milk-solid dumplings soaked in rose-flavored cardamom sugar syrup.",
            ratings: 4.8,
            stock: 50,
            images: [{ public_id: "haldiram_jamun", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Sweet Mango Lassi",
            price: 90,
            description: "Refreshing yogurt beverage churned with Alphonso mango pulp and a hint of cardamom.",
            ratings: 4.6,
            stock: 30,
            images: [{ public_id: "haldiram_lassi", url: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop" }],
          },
        ],
      },
    ],
  },
  {
    name: "Dindigul Thalappakatti",
    categories: [
      {
        category: "Signature Biryanis",
        items: [
          {
            name: "Thalappakatti Mutton Biryani",
            price: 360,
            description: "Legendary Seeraga Samba rice cooked with tender farm-fresh mutton and traditional secret spices.",
            ratings: 4.8,
            stock: 35,
            images: [{ public_id: "thalappakatti_mutton", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Thalappakatti Chicken Biryani",
            price: 290,
            description: "Aromatic Seeraga Samba chicken biryani slow-dum cooked in authentic Dindigul country style.",
            ratings: 4.7,
            stock: 50,
            images: [{ public_id: "thalappakatti_chicken", url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "Starters & Curries",
        items: [
          {
            name: "Chicken 65",
            price: 220,
            description: "Deep-fried spiced chicken morsels tempered with curry leaves, crushed garlic, and green chilies.",
            ratings: 4.6,
            stock: 40,
            images: [{ public_id: "thalappakatti_chicken65", url: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Butter Naan (2 Pcs)",
            price: 80,
            description: "Tandoor baked leavened flatbread brushed generously with molten butter.",
            ratings: 4.5,
            stock: 60,
            images: [{ public_id: "thalappakatti_naan", url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop" }],
          },
        ],
      },
    ],
  },
  {
    name: "Empire restaurant ",
    categories: [
      {
        category: "Empire Specials",
        items: [
          {
            name: "Empire Special Chicken Kebab",
            price: 240,
            description: "Crispy outside, succulent inside marinated chicken fried to deep crimson perfection.",
            ratings: 4.7,
            stock: 45,
            images: [{ public_id: "empire_kebab", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Tandoori Chicken (Half)",
            price: 280,
            description: "Clay oven roasted chicken marinated in yogurt, Kashmiri degi mirch, and roasted spices.",
            ratings: 4.6,
            stock: 30,
            images: [{ public_id: "empire_tandoori", url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Coin Parotta (3 Pcs)",
            price: 90,
            description: "Flaky, layered Malabar style parottas hot off the tawa, perfect with spicy chicken gravies.",
            ratings: 4.5,
            stock: 60,
            images: [{ public_id: "empire_parotta", url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "Biryanis & Curries",
        items: [
          {
            name: "Empire Chicken Biryani",
            price: 270,
            description: "Flavourful long-grain basmati biryani with spiced chicken pieces and boiled egg.",
            ratings: 4.5,
            stock: 40,
            images: [{ public_id: "empire_biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Butter Chicken",
            price: 310,
            description: "Charcoal grilled chicken tikka in a creamy tomato gravy with aromatic fenugreek.",
            ratings: 4.8,
            stock: 30,
            images: [{ public_id: "empire_butterchicken", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop" }],
          },
        ],
      },
    ],
  },
  {
    name: "Meghana's Biryani",
    categories: [
      {
        category: "Meghana Special Biryanis",
        items: [
          {
            name: "Meghana Special Chicken Biryani",
            price: 330,
            description: "Authentic Andhra spicy chicken boneless pieces layered over fragrant long-grain basmati rice.",
            ratings: 4.9,
            stock: 50,
            images: [{ public_id: "meghana_special", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Paneer Biryani",
            price: 260,
            description: "Tender paneer cubes cooked in fiery Andhra spices, served with aromatic biryani rice and raita.",
            ratings: 4.5,
            stock: 35,
            images: [{ public_id: "meghana_paneer", url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "Starters & Andhra Curries",
        items: [
          {
            name: "Chicken 555 Starter",
            price: 280,
            description: "Crispy fried chicken strips coated with crushed cashews, green chilies, and tangy sauce.",
            ratings: 4.8,
            stock: 30,
            images: [{ public_id: "meghana_555", url: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Lemon Chicken Dry",
            price: 270,
            description: "Tangy and spicy boneless chicken pieces tossed with lemon zest, pepper, and garlic.",
            ratings: 4.6,
            stock: 25,
            images: [{ public_id: "meghana_lemon", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop" }],
          },
        ],
      },
    ],
  },
  {
    name: "Daily Sushi",
    categories: [
      {
        category: "Classic Sushi Rolls",
        items: [
          {
            name: "California Roll (8 Pcs)",
            price: 390,
            description: "Crab sticks, avocado, and cucumber rolled inside-out with toasted sesame seeds and Japanese mayo.",
            ratings: 4.7,
            stock: 25,
            images: [{ public_id: "sushi_california", url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Spicy Salmon Maki",
            price: 450,
            description: "Fresh Atlantic salmon tossed in spicy sriracha mayo wrapped with sushi rice and nori sheet.",
            ratings: 4.9,
            stock: 20,
            images: [{ public_id: "sushi_salmon", url: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "Bowls & Appetizers",
        items: [
          {
            name: "Chicken Teriyaki Bento Bowl",
            price: 340,
            description: "Grilled chicken glazed with sweet teriyaki sauce over steamed rice, pickled ginger, and greens.",
            ratings: 4.6,
            stock: 30,
            images: [{ public_id: "sushi_teriyaki", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Steamed Edamame with Sea Salt",
            price: 180,
            description: "Warm young soybeans tossed with coarse Himalayan sea salt.",
            ratings: 4.5,
            stock: 35,
            images: [{ public_id: "sushi_edamame", url: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=600&auto=format&fit=crop" }],
          },
        ],
      },
    ],
  },
  {
    name: "Mani's Dum Biryani",
    categories: [
      {
        category: "Dum Biryanis",
        items: [
          {
            name: "Mani's Chicken Dum Biryani",
            price: 260,
            description: "Traditional Bangalore style dum biryani prepared with tender chicken and mint coriander spices.",
            ratings: 4.6,
            stock: 45,
            images: [{ public_id: "manis_chicken", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Mutton Dum Biryani",
            price: 340,
            description: "Slow-cooked mutton biryani with flavorful aromatic spices, served with brinjal gravy and onion raita.",
            ratings: 4.8,
            stock: 30,
            images: [{ public_id: "manis_mutton", url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "Sides & Starters",
        items: [
          {
            name: "Chicken Pepper Fry",
            price: 210,
            description: "Dry roasted chicken infused with crushed black Tellicherry peppercorns and fresh curry leaves.",
            ratings: 4.7,
            stock: 30,
            images: [{ public_id: "manis_pepper", url: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Gulab Jamun (2 Pcs)",
            price: 60,
            description: "Classic soft cottage cheese sweets soaked in sweet cardamom sugar syrup.",
            ratings: 4.5,
            stock: 50,
            images: [{ public_id: "manis_sweet", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop" }],
          },
        ],
      },
    ],
  },
  {
    name: "KFC",
    categories: [
      {
        category: "Hot & Crispy Buckets",
        items: [
          {
            name: "8 Pc Hot & Crispy Chicken Bucket",
            price: 650,
            description: "8 pieces of KFC signature bone-in chicken marinated in secret 11 herbs and spices, fried extra crispy.",
            ratings: 4.7,
            stock: 30,
            images: [{ public_id: "kfc_bucket", url: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop" }],
          },
          {
            name: "6 Pc Boneless Strips with Dip",
            price: 280,
            description: "Tender boneless chicken strips fried crunchy golden, served with spicy tandoori mayonnaise.",
            ratings: 4.6,
            stock: 45,
            images: [{ public_id: "kfc_strips", url: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop" }],
          },
        ],
      },
      {
        category: "Burgers & Beverages",
        items: [
          {
            name: "Classic Zinger Burger",
            price: 190,
            description: "Signature crunchy chicken fillet crowned with creamy mayo and fresh lettuce in a toasted sesame bun.",
            ratings: 4.8,
            stock: 40,
            images: [{ public_id: "kfc_zinger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Chilled Pepsi Can (330ml)",
            price: 60,
            description: "Ice-cold refreshing carbonated cola beverage.",
            ratings: 4.5,
            stock: 80,
            images: [{ public_id: "kfc_pepsi", url: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&auto=format&fit=crop" }],
          },
        ],
      },
    ],
  },
  {
    name: "Imperial Restaurant Since 1954",
    categories: [
      {
        category: "Heritage Specials",
        items: [
          {
            name: "Imperial Mutton Biryani",
            price: 340,
            description: "Heritage recipe mutton biryani with authentic old-Bengaluru flavours and spices.",
            ratings: 4.8,
            stock: 35,
            images: [{ public_id: "imperial_mutton", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Butter Chicken Masala",
            price: 290,
            description: "Rich velvety tomato cashew gravy with succulent tandoori roasted chicken chunks.",
            ratings: 4.7,
            stock: 30,
            images: [{ public_id: "imperial_butterchicken", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop" }],
          },
          {
            name: "Garlic Naan (2 Pcs)",
            price: 90,
            description: "Freshly baked tandoori naan topped with roasted minced garlic and fresh coriander.",
            ratings: 4.6,
            stock: 50,
            images: [{ public_id: "imperial_garlicnaan", url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop" }],
          },
        ],
      },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB for seeding...");

    // Find all existing restaurants
    const existingRestaurants = await Restaurant.find();
    console.log(`Found ${existingRestaurants.length} restaurants in DB`);

    // Remove existing menus and fooditems to avoid duplicates
    await Menu.deleteMany({});
    await FoodItem.deleteMany({});
    console.log("Cleaned existing Menu and FoodItem collections.");

    for (const restData of restaurantData) {
      // Find matching restaurant by name (case-insensitive substring)
      const rest = existingRestaurants.find((r) =>
        r.name.trim().toLowerCase().includes(restData.name.trim().toLowerCase()) ||
        restData.name.trim().toLowerCase().includes(r.name.trim().toLowerCase())
      );

      if (!rest) {
        console.log(`Warning: Restaurant '${restData.name}' not found in DB, skipping`);
        continue;
      }

      console.log(`Seeding menu for: ${rest.name} (${rest._id})`);

      const menuCategories = [];

      for (const catData of restData.categories) {
        const itemIds = [];

        for (const item of catData.items) {
          const foodItemDoc = await FoodItem.create({
            name: item.name,
            price: item.price,
            description: item.description,
            ratings: item.ratings,
            stock: item.stock,
            images: item.images,
            restaurant: rest._id,
            numberOfReviews: Math.floor(Math.random() * 40) + 10,
          });

          itemIds.push(foodItemDoc._id);
        }

        menuCategories.push({
          category: catData.category,
          items: itemIds,
        });
      }

      // Create Menu doc for this restaurant
      const menuDoc = await Menu.create({
        restaurant: rest._id,
        menu: menuCategories,
      });

      // Update food items to reference this menu
      for (const cat of menuCategories) {
        await FoodItem.updateMany(
          { _id: { $in: cat.items } },
          { $set: { menu: menuDoc._id } }
        );
      }

      console.log(`✓ Menu seeded for ${rest.name} with ${menuCategories.length} categories.`);
    }

    const totalFood = await FoodItem.countDocuments();
    const totalMenus = await Menu.countDocuments();
    console.log(`SUCCESS! Seeded ${totalFood} Food Items across ${totalMenus} Restaurant Menus.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
