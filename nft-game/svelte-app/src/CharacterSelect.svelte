<script>
  import { onMount } from "svelte";
  import { ethers } from "ethers";
  import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
  import myEpicGame from "./MyEpicGame.json";
  export let setCharacterNFT;
  let characters = [];
  let gameContract;
  let minting = false;

  $: gameContract, getCharacters();

  const onCharacterMint = async (sender, tokenId, characterIndex) => {
    console.log(
      `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
    );
    if (gameContract) {
      const characterNFT = await gameContract.checkIfUserHasNFT();
      console.log("CharacterNFT: ", characterNFT);
      setCharacterNFT(transformCharacterData(characterNFT));
    }
  };

  const getCharacters = async () => {
    if (!gameContract) return;
    try {
      console.log("Getting contract characters to mint");
      const charactersTxn = await gameContract.getAllDefaultCharacters();
      console.log("charactersTxn:", charactersTxn);
      const _characters = charactersTxn.map((characterData) =>
        transformCharacterData(characterData)
      );
      characters = _characters;
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    } catch (error) {
      console.error("Something went wrong fetching characters:", error);
    }
  };

  const mintCharacterNFTAction = async (event) => {
    const characterId = Number(event.currentTarget.dataset.index);
    try {
      if (gameContract) {
        minting = true;
        console.log("Minting character in progress...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
    }
  };

  onMount(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const _gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      gameContract = _gameContract;
    } else {
      console.log("Ethereum object not found");
    }
    return () => {
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  });
</script>

<div>
  <h3>Character Select</h3>
  {#if minting}
    <h3>... Minting ...</h3>
  {/if}
  <ul>
    {#each characters as chr, idx (chr.name)}
      <li class="flex">
        <img src={chr.imageURI} width="32" alt="" />
        <span>{chr.name}</span>
        <div
          class="mint-btn"
          data-index={idx}
          on:click={mintCharacterNFTAction}
        >
          MINT
        </div>
      </li>
    {/each}
  </ul>
</div>

<style>
  h3 {
    color: white;
  }
  ul {
    list-style-type: none;
  }
  .flex {
    display: flex;
    align-items: center;
    gap: 15px;
    border-radius: 5px;
    color: white;
    width: 250px;
    justify-content: space-between;
    margin: 5px auto;
    padding: 10px 15px;
  }
  .flex > img {
    border-radius: 30px;
    width: 32px;
    height: 32px;
  }
  .flex:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .mint-btn {
    color: black;
    padding: 5px 15px;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
    user-select: none;
    font-size: 12px;
    font-weight: bold;
  }
</style>
