exports.categorize = (text) => {
  text = text.toLowerCase();

  if (text.includes("payment")) return "Payment Issue";
  if (text.includes("delivery")) return "Delivery Issue";
  if (text.includes("login")) return "Auth Issue";

  return "General";
};