const CONTRACT_ADDRESS = '0x8c19FF6aA1D6465292497AFE89462DbE6D5F77fD';

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export {
  CONTRACT_ADDRESS,
  transformCharacterData,
}