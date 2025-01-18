function getRandomElement<T extends readonly string[]>(array: T): T[number] {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export default getRandomElement;
