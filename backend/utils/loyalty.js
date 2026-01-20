// utils/loyalty.js
export const calculateLoyaltyPoints = (totalAmount) => {
  const pointsPer100DT = 10; // 10 points pour 100 DT
  return Math.floor((totalAmount / 100) * pointsPer100DT);
};
