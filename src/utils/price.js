// Price helpers for tour packages.
// A discount is only shown when there is a real markdown:
// originalPrice must exist and be strictly greater than the selling price.
// e.g. selling price 2000 + original price 0  -> no original price, no OFF%.

export const getValidOriginalPrice = (price = 0, originalPrice = 0) => {
  const selling = Number(price) || 0;
  const original = Number(originalPrice) || 0;
  return original > selling ? original : 0;
};

export const getDiscountPercent = (price = 0, originalPrice = 0) => {
  const original = getValidOriginalPrice(price, originalPrice);
  if (!original) return 0;
  return Math.round((1 - (Number(price) || 0) / original) * 100);
};
