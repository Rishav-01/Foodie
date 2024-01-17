require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    const limit = 5;
    const categories = await Category.find({}).limit(limit);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limit);
    const indian = await Recipe.find({ category: "Indian" }).limit(limit);
    const american = await Recipe.find({ category: "American" }).limit(limit);
    const chinese = await Recipe.find({ category: "Chinese" }).limit(limit);

    const food = { latest, indian, american, chinese };

    res.render("index", { title: "Foodie - Home", categories, food });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limit = 20;
    const categories = await Category.find({}).limit(limit);
    res.render("categories", {
      title: "FOodie - Categoreis",
      categories,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limit = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limit
    );
    console.log(categoryById[0].category);
    res.render("categories", {
      title: "Foodie - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).render("not-found");
  }
};

/**
 * GET /recipe/:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Foodie - Recipe", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Foodie - Search", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explplore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limit = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limit);
    res.render("explore-latest", {
      title: "Foodie - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Foodie - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Foodie - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    // res.json(error);
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

// Delete Recipe
async function deleteRecipe() {
  try {
    await Recipe.deleteOne({ name: "New Recipe From Form" });
  } catch (error) {
    console.log(error);
  }
}
deleteRecipe();

// Update Recipe
async function updateRecipe() {
  try {
    const res = await Recipe.updateOne(
      { name: "New Recipe" },
      { name: "New Recipe Updated" }
    );
    res.n; // Number of documents matched
    res.nModified; // Number of documents modified
  } catch (error) {
    console.log(error);
  }
}
updateRecipe();

/**
 * Dummy Data Example
 */

async function insertDymmyCategoryData() {
  try {
    await Category.insertMany([
      {
        name: "Thai",
        image: "thai-food.jpg",
      },
      {
        name: "American",
        image: "american-food.jpg",
      },
      {
        name: "Chinese",
        image: "chinese-food.jpg",
      },
      {
        name: "Mexican",
        image: "mexican-food.jpg",
      },
      {
        name: "Indian",
        image: "indian-food.jpg",
      },
      {
        name: "Spanish",
        image: "spanish-food.jpg",
      },
    ]);
  } catch (error) {
    console.log("err", +error);
  }
}

// insertDymmyCategoryData();

async function insertDymmyRecipeData() {
  try {
    await Recipe.insertMany([
      {
        name: "Crab cakes",
        description: `Recipe Description Goes Here`,
        email: "recipeemail@test.com",
        ingredients: ["Enter ingredients"],
        category: "Indian",
        image: "southern-friend-chicken.jpg",
      },
      {
        name: "Recipe Name Goes Here",
        description: `Recipe Description Goes Here`,
        email: "recipeemail@test.com",
        ingredients: ["Enter ingredients"],
        category: "American",
        image: "southern-friend-chicken.jpg",
      },
      {
        name: "Recipe Name Goes Here",
        description: `Recipe Description Goes Here`,
        email: "recipeemail@test.com",
        ingredients: ["Enter ingredients"],
        category: "Chinese",
        image: "southern-friend-chicken.jpg",
      },
      {
        name: "Recipe Name Goes Here",
        description: `Recipe Description Goes Here`,
        email: "recipeemail@test.com",
        ingredients: ["Enter ingredients"],
        category: "Thai",
        image: "southern-friend-chicken.jpg",
      },
      {
        name: "Recipe Name Goes Here",
        description: `Recipe Description Goes Here`,
        email: "recipeemail@test.com",
        ingredients: ["Enter ingredients"],
        category: "Mexican",
        image: "southern-friend-chicken.jpg",
      },
    ]);
  } catch (error) {
    console.log("err", +error);
  }
}

// insertDymmyRecipeData();

// About
exports.about = async (req, res) => {
  res.render("about");
};
