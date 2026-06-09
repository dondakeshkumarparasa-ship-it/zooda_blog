const express = require('express');
const {
  getCategories,
  createCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory
} = require('./category.controller');

const router = express.Router();

router.get('/admin/categories', getCategories);
router.post('/admin/categories', createCategory);
router.delete('/admin/categories/:id', deleteCategory);
router.post('/admin/categories/:categoryId/subcategories', createSubcategory);
router.delete('/admin/categories/:categoryId/subcategories/:subcategoryId', deleteSubcategory);

module.exports = router;
