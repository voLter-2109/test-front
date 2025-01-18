const getRandomDate = () => {
  const startDate = new Date(1994, 0, 1);
  const endDate = new Date(2005, 0, 1);

  return Math.random() * (endDate.getTime() - startDate.getTime());
};

export default getRandomDate;
