export const getCategoryColor = (category: string) => {
  const colors = [
    "blue",
    "green",
    "volcano",
    "gold",
    "purple",
    "magenta",
    "cyan",
    "lime",
    "orange",
    "red",
    "geekblue",
  ];
  const index =
    category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};
