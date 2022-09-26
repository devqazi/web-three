<script>
  import { onMount } from "svelte";
  import { ethers } from "ethers";
  import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
  import myEpicGame from "./MyEpicGame.json";
  export let characterNFT;
  let gameContract;
  let boss;
  let attackState = '';

  $: gameContract, fetchBoss();

  const fetchBoss = async () => {
    if (!gameContract) return;
    const bossTxn = await gameContract.getBigBoss();
    console.log("Boss:", bossTxn);
    boss = transformCharacterData(bossTxn);
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
  });

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        attackState = "attacking";
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        attackState = "hit";
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      attackState = '';
    }
  };
</script>

<div class="wrapper">
  <h2>Battle Arena</h2>
  {#if boss}
    <div class="boss">
      <img src={boss.imageURI} alt="" />
      <div class="health-container">
        <div class="hp-bar" style="width:{(boss.hp / boss.maxHp) * 100}%">
          HP {boss.hp} / {boss.maxHp}
        </div>
      </div>
      <div class="attack-btn" on:click={runAttackAction}>⚔️ ATTACK ⚔️</div>
    </div>
  {/if}
  {#if characterNFT}
    <div class="character">
      <img src={characterNFT.imageURI} alt="" />
      <b>{characterNFT.name}</b>
      <span>❤️ {characterNFT.hp} / {characterNFT.maxHp}</span>
    </div>
  {/if}
</div>

<style>
  .wrapper {
    color: white;
  }
  .character {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 10px 15px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    margin: 15px auto;
    max-width: 300px;
  }
  .character > img {
    border-radius: 30px;
    width: 32px;
    height: 32px;
  }
  .attack-btn {
    max-width: max-content;
    border-radius: 5px;
    margin: 15px auto;
    border: 2px dashed white;
    padding: 10px 25px;
    cursor: pointer;
    user-select: none;
    font-weight: bold;
    opacity: 0.6;
  }
  .attack-btn:hover {
    opacity: 1;
  }
  .boss > img {
    width: 200px;
    height: 200px;
    border-radius: 5px;
  }
  .health-container {
    width: 200px;
    background-color: rgba(0, 0, 0, 0.25);
    height: 24px;
    margin: 0 auto 15px auto;
    border: 2px solid white;
  }
  .hp-bar {
    background-color: crimson;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-family: monospace;
  }
</style>
