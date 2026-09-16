import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const categories = [
  { name: "Face Care", slug: "face-care", description: "Nourishing facial skincare for a radiant glow", image: "/images/face-care.jpg" },
  { name: "Body Care", slug: "body-care", description: "Luxurious body lotions and butters", image: "/images/body-care.jpg" },
  { name: "Hair Care", slug: "hair-care", description: "Natural hair treatments and oils", image: "/images/hair-care.jpg" },
  { name: "Lip Care", slug: "lip-care", description: "Moisturizing lip balms and scrubs", image: "/images/lip-care.jpg" },
  { name: "Soaps", slug: "soaps", description: "Handcrafted organic soaps", image: "/images/soaps.jpg" },
  { name: "Gifts", slug: "gifts", description: "Curated gift sets for every occasion", image: "/images/gifts.jpg" },
];

const products = [
  {
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-brightening-serum",
    description: "A potent Vitamin C serum that brightens skin tone, reduces dark spots, and boosts collagen production. Formulated with 20% stable Vitamin C, hyaluronic acid, and vitamin E for maximum absorption and minimal irritation.",
    ingredients: "Ascorbic Acid (Vitamin C), Hyaluronic Acid, Tocopherol (Vitamin E), Ferulic Acid, Squalane, Aloe Vera",
    usage: "Apply 3-4 drops to clean, dry skin after toning. Use morning and evening. Follow with moisturizer and SPF during the day.",
    price: 34.99,
    comparePrice: 44.99,
    images: ["/images/products/vitamin-c-serum-1.jpg", "/images/products/vitamin-c-serum-2.jpg"],
    categorySlug: "face-care",
    stock: 50,
    isFeatured: true,
  },
  {
    name: "Hyaluronic Acid Moisture Cream",
    slug: "hyaluronic-acid-moisture-cream",
    description: "An ultra-hydrating face cream with triple-weight hyaluronic acid that plumps and hydrates at every layer of the skin. Lightweight yet deeply nourishing.",
    ingredients: "Sodium Hyaluronate, Ceramides, Squalane, Shea Butter, Niacinamide, Panthenol",
    usage: "Apply generously to face and neck after serum. Use morning and evening.",
    price: 28.99,
    comparePrice: null,
    images: ["/images/products/ha-cream-1.jpg", "/images/products/ha-cream-2.jpg"],
    categorySlug: "face-care",
    stock: 35,
    isFeatured: true,
  },
  {
    name: "Shea Butter Body Lotion",
    slug: "shea-butter-body-lotion",
    description: "A rich, fast-absorbing body lotion made with raw shea butter and coconut oil. Deeply moisturizes without feeling greasy. Perfect for dry skin.",
    ingredients: "Shea Butter, Coconut Oil, Jojoba Oil, Aloe Vera, Vitamin E, Lavender Essential Oil",
    usage: "Apply liberally to damp skin after shower. Massage in circular motions until absorbed.",
    price: 22.99,
    comparePrice: 27.99,
    images: ["/images/products/shea-butter-lotion-1.jpg", "/images/products/shea-butter-lotion-2.jpg"],
    categorySlug: "body-care",
    stock: 40,
    isFeatured: true,
  },
  {
    name: "Organic Rosehip Oil",
    slug: "organic-rosehip-oil",
    description: "Cold-pressed organic rosehip oil rich in essential fatty acids and antioxidants. Helps reduce scars, fine lines, and hyperpigmentation.",
    ingredients: "100% Organic Rosa Canina (Rosehip) Seed Oil",
    usage: "Apply 2-3 drops to damp skin after cleansing. Can be used alone or mixed with moisturizer.",
    price: 18.99,
    comparePrice: 24.99,
    images: ["/images/products/rosehip-oil-1.jpg", "/images/products/rosehip-oil-2.jpg"],
    categorySlug: "face-care",
    stock: 25,
    isFeatured: true,
  },
  {
    name: "Lavender & Chamomile Body Butter",
    slug: "lavender-chamomile-body-butter",
    description: "A whipped body butter infused with calming lavender and chamomile. Perfect for evening self-care routines. Leaves skin silky smooth.",
    ingredients: "Shea Butter, Cocoa Butter, Almond Oil, Lavender Essential Oil, Chamomile Extract, Vitamin E",
    usage: "Warm a small amount in palms and massage into skin until fully absorbed.",
    price: 26.99,
    comparePrice: null,
    images: ["/images/products/lavender-body-butter-1.jpg", "/images/products/lavender-body-butter-2.jpg"],
    categorySlug: "body-care",
    stock: 30,
    isFeatured: false,
  },
  {
    name: "Hair Growth Elixir",
    slug: "hair-growth-elixir",
    description: "A potent blend of natural oils that stimulate hair follicles, reduce breakage, and promote thicker, healthier hair growth.",
    ingredients: "Castor Oil, Rosemary Oil, Peppermint Oil, Jojoba Oil, Vitamin E, Biotin",
    usage: "Massage into scalp 2-3 times per week. Leave on for at least 30 minutes or overnight before washing.",
    price: 24.99,
    comparePrice: 29.99,
    images: ["/images/products/hair-elixir-1.jpg", "/images/products/hair-elixir-2.jpg"],
    categorySlug: "hair-care",
    stock: 20,
    isFeatured: true,
  },
  {
    name: "Tinted Lip Balm - Rose",
    slug: "tinted-lip-balm-rose",
    description: "A nourishing tinted lip balm with a beautiful rose hue. Made with beeswax, shea butter, and natural pigments for a hint of color and lasting moisture.",
    ingredients: "Beeswax, Shea Butter, Coconut Oil, Rosehip Oil, Natural Iron Oxides, Vitamin E",
    usage: "Apply to lips as needed throughout the day.",
    price: 12.99,
    comparePrice: 15.99,
    images: ["/images/products/lip-balm-rose-1.jpg", "/images/products/lip-balm-rose-2.jpg"],
    categorySlug: "lip-care",
    stock: 60,
    isFeatured: false,
  },
  {
    name: "Activated Charcoal Face Soap",
    slug: "activated-charcoal-face-soap",
    description: "A deep-cleansing facial soap with activated charcoal to draw out impurities and excess oil. Gentle enough for daily use.",
    ingredients: "Olive Oil, Coconut Oil, Activated Charcoal, Kaolin Clay, Tea Tree Oil, Aloe Vera",
    usage: "Lather between wet hands and massage onto face. Rinse thoroughly. Use morning and evening.",
    price: 14.99,
    comparePrice: null,
    images: ["/images/products/charcoal-soap-1.jpg", "/images/products/charcoal-soap-2.jpg"],
    categorySlug: "soaps",
    stock: 45,
    isFeatured: false,
  },
  {
    name: "Glycolic Acid Toner",
    slug: "glycolic-acid-toner",
    description: "A gentle 5% glycolic acid toner that exfoliates dead skin cells, unclogs pores, and improves skin texture. Suitable for all skin types.",
    ingredients: "Glycolic Acid, Aloe Vera, Green Tea Extract, Niacinamide, Panthenol",
    usage: "After cleansing, apply to a cotton pad and sweep across face and neck. Use in PM routine only. Follow with moisturizer.",
    price: 20.99,
    comparePrice: 25.99,
    images: ["/images/products/glycolic-toner-1.jpg", "/images/products/glycolic-toner-2.jpg"],
    categorySlug: "face-care",
    stock: 30,
    isFeatured: false,
  },
  {
    name: "Self-Care Gift Set",
    slug: "self-care-gift-set",
    description: "The ultimate self-care bundle featuring our best-selling Vitamin C Serum, Shea Body Lotion, Rose Lip Balm, and a lavender-scented candle. Beautifully packaged in a reusable gift box.",
    ingredients: "",
    usage: "",
    price: 69.99,
    comparePrice: 89.99,
    images: ["/images/products/gift-set-1.jpg", "/images/products/gift-set-2.jpg"],
    categorySlug: "gifts",
    stock: 15,
    isFeatured: true,
  },
  {
    name: "Tea Tree & Neem Face Wash",
    slug: "tea-tree-neem-face-wash",
    description: "A clarifying face wash with tea tree oil and neem extract. Helps control acne and balance oil production without stripping the skin.",
    ingredients: "Tea Tree Oil, Neem Extract, Aloe Vera, Salicylic Acid, Glycerin",
    usage: "Massage a pea-sized amount onto damp skin. Rinse with lukewarm water. Use twice daily.",
    price: 16.99,
    comparePrice: 19.99,
    images: ["/images/products/tea-tree-wash-1.jpg", "/images/products/tea-tree-wash-2.jpg"],
    categorySlug: "face-care",
    stock: 40,
    isFeatured: false,
  },
  {
    name: "Mango & Coconut Body Scrub",
    slug: "mango-coconut-body-scrub",
    description: "A tropical sugar scrub that gently exfoliates while coconut oil and mango butter deeply moisturize. Leaves skin smooth, glowing, and lightly fragranced.",
    ingredients: "Brown Sugar, Coconut Oil, Mango Butter, Jojoba Beads, Vitamin E, Natural Fragrance",
    usage: "In the shower, massage onto damp skin in circular motions. Rinse thoroughly. Use 2-3 times per week.",
    price: 24.99,
    comparePrice: null,
    images: ["/images/products/mango-scrub-1.jpg", "/images/products/mango-scrub-2.jpg"],
    categorySlug: "body-care",
    stock: 25,
    isFeatured: false,
  },
];

async function main() {
  console.log("Seeding database...");

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, image: cat.image },
      create: cat,
    });
    console.log(`  Category: ${cat.name}`);
  }

  for (const prod of products) {
    const category = await db.category.findUnique({ where: { slug: prod.categorySlug } });
    if (!category) {
      console.warn(`  Skipping ${prod.name}: category ${prod.categorySlug} not found`);
      continue;
    }
    const { categorySlug, ...data } = prod;
    await db.product.upsert({
      where: { slug: prod.slug },
      update: { ...data, categoryId: category.id },
      create: { ...data, categoryId: category.id },
    });
    console.log(`  Product: ${prod.name}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
