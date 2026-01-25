// utils/loyalty.js
export const calculateLoyaltyPoints = (totalAmount) => {
  const pointsPer100DT = 10; // 10 points pour 100 DT
  return Math.floor((totalAmount / 100) * pointsPer100DT);
};
export const applyLoyaltyPoints = ({ user, orderTotal, pointsToApply }) => {
  const POINT_RATE = 10; // 10 points = 1 DT

  if (!pointsToApply || user.loyaltyPoints <= 0) {
    return {
      discount: 0,
      finalTotal: orderTotal,
      pointsUsed: 0
    };
  }

  const usablePoints = Math.min(pointsToApply, user.loyaltyPoints);
  const discount = usablePoints / POINT_RATE;

  return {
    discount,
    finalTotal: Math.max(orderTotal - discount, 0),
    pointsUsed: usablePoints
  };
};