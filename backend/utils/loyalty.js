// utils/loyalty.js
export const calculateLoyaltyPoints = (totalAmount) => {
  const pointsPer100DT = 10; // 10 points pour 100 DT
  return Math.floor((totalAmount / 100) * pointsPer100DT);
};
export const applyLoyaltyPoints = ({ user, total, pointsToApply }) => {
  const POINTS_CONVERSION = 10; // 10 points = 1 DT

  // S'assurer que l'utilisateur ne peut pas utiliser plus de points qu'il n'en possède
  const usablePoints = Math.min(pointsToApply, user.loyaltyPoints);

  // Calculer la remise en DT
  const discount = usablePoints / POINTS_CONVERSION;

  // Nouveau total après remise
  const newTotal = Math.max(total - discount, 0);

  return {
    discount,
    newTotal,
    pointsUsed: usablePoints
  };
};