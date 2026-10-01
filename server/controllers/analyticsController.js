const Product = require("../models/product");
const Order = require("../models/order");

const calculateSimilarityScore = (target, candidate) => {
  let score = 0;
  if (candidate.category && target.category && candidate.category.toLowerCase() === target.category.toLowerCase()) {
    score += 5;
  }
  const targetTags = target.tags || [];
  const candidateTags = candidate.tags || [];
  const sharedTags = candidateTags.filter((tag) =>
    targetTags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
  score += sharedTags.length * 2;

  const priceDiff = Math.abs(candidate.price - target.price);
  const normalizedDistance = Math.max(0, 1 - priceDiff / Math.max(target.price, 1));
  score += normalizedDistance * 2;
  score += (candidate.ratings || 0) * 0.4;

  return score;
};

const getProductRecommendations = async (req, res, next) => {
  try {
    const source = await Product.findById(req.params.productId);
    if (!source) return res.status(404).json({ success: false, message: "Target product not found" });

    const candidates = await Product.find({ _id: { $ne: source._id } }).lean();
    if (candidates.length === 0) {
      return res.status(200).json({ success: true, count: 0, recommendations: [] });
    }

    const rankedRecommendations = candidates
      .map((product) => ({
        product,
        similarity: calculateSimilarityScore(source, product),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 6)
      .map((entry) => entry.product);

    res.status(200).json({
      success: true,
      engine: "content-similarity",
      count: rankedRecommendations.length,
      recommendations: rankedRecommendations,
    });
  } catch (error) {
    next(error);
  }
};

const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const pastOrders = await Order.find({ user: req.user._id, status: { $ne: "cancelled" } }).lean();
    const purchasedProductIds = pastOrders.flatMap((order) =>
      order.items.map((item) => (item.product ? item.product.toString() : null)).filter(Boolean)
    );

    if (purchasedProductIds.length === 0) {
      const topRated = await Product.find().sort({ ratings: -1, createdAt: -1 }).limit(6);
      return res.status(200).json({
        success: true,
        engine: "catalog-popularity",
        count: topRated.length,
        recommendations: topRated,
      });
    }

    const purchasedProducts = await Product.find({ _id: { $in: purchasedProductIds } }).select("category");
    const preferredCategories = [...new Set(purchasedProducts.map((p) => p.category))];

    let recommendations = await Product.find({
      category: { $in: preferredCategories },
      _id: { $nin: purchasedProductIds },
    })
      .sort({ ratings: -1 })
      .limit(6);

    if (recommendations.length < 4) {
      const additional = await Product.find({
        _id: { $nin: [...purchasedProductIds, ...recommendations.map((r) => r._id)] },
      })
        .sort({ ratings: -1 })
        .limit(6 - recommendations.length);

      recommendations = [...recommendations, ...additional];
    }

    res.status(200).json({
      success: true,
      engine: "customer-preference",
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductRecommendations, getPersonalizedRecommendations };