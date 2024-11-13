export function generateRandomNickname(): string {
  const adjectives = [
    '우아한',
    '지혜로운',
    '거침없는',
    '상냥한',
    '찬란한',
    '신비로운',
    '냉철한',
    '장난스러운',
    '용맹한',
    '평화로운',
  ];
  const colors = [
    '금빛',
    '민트',
    '자주',
    '크림',
    '하늘빛',
    '무지개',
    '흑청',
    '코랄',
    '청록',
    '옥색',
  ];
  const animals = [
    '늑대',
    '코끼리',
    '독수리',
    '고양이',
    '여우',
    '펭귄',
    '호랑이',
    '다람쥐',
    '사슴',
    '양치기',
  ];

  const randomElement = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  return `${randomElement(adjectives)}${randomElement(colors)}${randomElement(animals)}`;
}
