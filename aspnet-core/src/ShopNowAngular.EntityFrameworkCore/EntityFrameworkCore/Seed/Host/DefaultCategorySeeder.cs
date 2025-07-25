using System;
using System.Collections.Generic;
using System.Linq;
using ShopNowAngular.Categories;
using ShopNowAngular.SubCategories;
using ShopNowAngular.SubSubCategories;

namespace ShopNowAngular.EntityFrameworkCore.Seed.Host
{
    public class DefaultCategorySeeder
    {
        private readonly ShopNowAngularDbContext _context;

        public DefaultCategorySeeder(ShopNowAngularDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            if (_context.Categories.Any())
            {
                return; // Already seeded
            }

            var categories = GetDefaultCategories();
            _context.Categories.AddRange(categories);
            _context.SaveChanges();
        }

        private List<Category> GetDefaultCategories()
        {
            var categories = new List<Category>();

            var categoryData = new List<(string Name, List<(string SubName, List<string> SubSubNames)>)>
            {
                ("Electronics", new List<(string, List<string>)>
                {
                    ("Mobile Phones", new List<string> { "Smartphones", "Feature Phones", "Foldables", "Gaming Phones" }),
                    ("Laptops", new List<string> { "Ultrabooks", "Gaming Laptops", "MacBooks", "Chromebooks" }),
                    ("Cameras", new List<string> { "DSLR", "Mirrorless", "Action Cameras", "Camcorders" }),
                    ("Televisions", new List<string> { "LED", "OLED", "QLED", "Smart TVs" }),
                }),

                ("Fashion", new List<(string, List<string>)>
                {
                    ("Men", new List<string> { "Shirts", "Trousers", "Watches", "Shoes" }),
                    ("Women", new List<string> { "Dresses", "Handbags", "Jewelry", "Footwear" }),
                    ("Kids", new List<string> { "Boys Clothing", "Girls Clothing", "Babywear", "Kids Footwear" }),
                    ("Accessories", new List<string> { "Sunglasses", "Belts", "Caps", "Wallets" }),
                }),

                ("Home & Kitchen", new List<(string, List<string>)>
                {
                    ("Furniture", new List<string> { "Beds", "Sofas", "Dining Tables", "Chairs" }),
                    ("Kitchen Appliances", new List<string> { "Microwaves", "Blenders", "Toasters", "Coffee Makers" }),
                    ("Home Decor", new List<string> { "Clocks", "Paintings", "Lamps", "Curtains" }),
                    ("Bedding", new List<string> { "Bedsheets", "Pillows", "Blankets", "Mattresses" }),
                }),

                ("Beauty & Health", new List<(string, List<string>)>
                {
                    ("Skincare", new List<string> { "Cleansers", "Moisturizers", "Serums", "Masks" }),
                    ("Haircare", new List<string> { "Shampoos", "Conditioners", "Oils", "Hair Styling" }),
                    ("Makeup", new List<string> { "Lipsticks", "Foundations", "Mascaras", "Blush" }),
                    ("Health Devices", new List<string> { "Thermometers", "BP Monitors", "Weighing Scales", "Oximeters" }),
                }),

                ("Sports & Outdoors", new List<(string, List<string>)>
                {
                    ("Fitness Equipment", new List<string> { "Treadmills", "Dumbbells", "Yoga Mats", "Resistance Bands" }),
                    ("Cycling", new List<string> { "Mountain Bikes", "Road Bikes", "Helmets", "Accessories" }),
                    ("Camping", new List<string> { "Tents", "Sleeping Bags", "Lanterns", "Camping Stoves" }),
                    ("Footwear", new List<string> { "Running Shoes", "Hiking Boots", "Cleats", "Sandals" }),
                }),

                ("Books & Stationery", new List<(string, List<string>)>
                {
                    ("Books", new List<string> { "Fiction", "Non-Fiction", "Comics", "Children’s Books" }),
                    ("Office Supplies", new List<string> { "Notebooks", "Files", "Pens", "Calculators" }),
                    ("Art Supplies", new List<string> { "Paints", "Brushes", "Sketchbooks", "Markers" }),
                    ("School Supplies", new List<string> { "Backpacks", "Lunch Boxes", "Pencil Cases", "Erasers" }),
                }),

                ("Toys & Games", new List<(string, List<string>)>
                {
                    ("Educational Toys", new List<string> { "STEM Toys", "Learning Games", "Flash Cards", "Puzzles" }),
                    ("Action Figures", new List<string> { "Superheroes", "Anime Figures", "Dinosaurs", "Robots" }),
                    ("Board Games", new List<string> { "Strategy Games", "Family Games", "Card Games", "Dice Games" }),
                    ("Outdoor Toys", new List<string> { "Bicycles", "Trampolines", "Slides", "Swing Sets" }),
                }),

                ("Automotive", new List<(string, List<string>)>
                {
                    ("Car Accessories", new List<string> { "Seat Covers", "Car Mats", "Phone Holders", "Car Fresheners" }),
                    ("Motorbike Gear", new List<string> { "Helmets", "Gloves", "Jackets", "Covers" }),
                    ("Car Electronics", new List<string> { "Dash Cams", "GPS", "Speakers", "Car Chargers" }),
                    ("Tools & Maintenance", new List<string> { "Tool Kits", "Car Jacks", "Polish", "Oil" }),
                }),
            };

            foreach (var (categoryName, subCategoryList) in categoryData)
            {
                var category = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = categoryName,
                    SubCategories = new List<SubCategory>()
                };

                foreach (var (subCatName, subSubCatNames) in subCategoryList)
                {
                    var subCategory = new SubCategory
                    {
                        Id = Guid.NewGuid(),
                        Name = subCatName,
                        CategoryId = category.Id,
                        SubSubCategories = new List<SubSubCategory>()
                    };

                    foreach (var subSubName in subSubCatNames)
                    {
                        var subSubCategory = new SubSubCategory
                        {
                            Id = Guid.NewGuid(),
                            Name = subSubName,
                            SubCategoryId = subCategory.Id
                        };

                        subCategory.SubSubCategories.Add(subSubCategory);
                    }

                    category.SubCategories.Add(subCategory);
                }

                categories.Add(category);
            }

            return categories;
        }
    }
}
