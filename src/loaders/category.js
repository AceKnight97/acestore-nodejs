export const batchCategories = async (keys, models) => {
  const categories = await models.Category.find({
    _id: {
      $in: keys,
    },
  });

  return keys.map((key) => categories.find((category) => category.id == key));
};
