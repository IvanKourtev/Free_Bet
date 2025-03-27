export const validateRevolutName = (name: string): boolean => {
  // Позволява само латински букви
  const latinOnlyRegex = /^[a-zA-Z]+$/;
  return latinOnlyRegex.test(name);
};

export const validateNickname = (nickname: string): boolean => {
  // Позволява латински букви, цифри, точки и долна черта
  const nicknameRegex = /^[a-zA-Z0-9._]+$/;
  return nicknameRegex.test(nickname);
}; 