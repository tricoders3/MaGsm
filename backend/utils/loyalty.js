// utils/loyalty.js

// 100 DT = 10 points
export const calculateLoyaltyPoints = (totalAmount) => {
  const pointsPer100DT = 10; // 10 points pour 100 DT
  return Math.floor((totalAmount / 100) * pointsPer100DT);
};

export const applyLoyaltyPoints = ({ user, total, pointsToApply }) => {
  // 1000 points = 100 DT  → 1 point = 0.1 DT
  const POINT_VALUE_DT = 0.1;

  // Ne pas dépasser les points disponibles
  const usablePoints = Math.min(pointsToApply, user.loyaltyPoints);

  // Calcul de la remise
  const discount = usablePoints * POINT_VALUE_DT;

  // Total après remise
  const newTotal = Math.max(total - discount, 0);

  return {
    discount,
    newTotal,
    pointsUsed: usablePoints
  };
};
