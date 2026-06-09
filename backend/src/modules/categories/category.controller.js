const Category = require('./category.model');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

const createSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }

    const existingSubcategory = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.toLowerCase()
    );

    if (existingSubcategory) {
      return res.status(400).json({ message: 'Subcategory already exists' });
    }

    category.subcategories.push({ name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating subcategory', error: error.message });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.subcategories.pull({ _id: req.params.subcategoryId });
    await category.save();

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory
};
