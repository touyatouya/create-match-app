export const generateUniqId = (ids: number[]) => {
  let id;
  do {
    id = Math.floor(Math.random() * 100000); // 0〜10000の自然数
  } while (ids.includes(id));

  return id;
};
