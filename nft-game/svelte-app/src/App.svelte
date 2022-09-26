<script>
	import { onMount } from "svelte";
	import BattleArena from "./BattleArena.svelte";
	import CharacterSelect from "./CharacterSelect.svelte";
	import MyEpicGame from "./MyEpicGame.json";
	import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
	import { ethers } from "ethers";
	let currentAccount;
	let characterNFT;

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				return console.log("Make sure you have MetaMask!");
			} else {
				console.log("We have the ethereum object", ethereum);
				const accounts = await ethereum.request({ method: "eth_accounts" });
				if (accounts.length !== 0) {
					const account = accounts[0];
					console.log("Found an authorized account:", account);
					currentAccount = account;
				} else {
					console.log("No authorized account found");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	/*
	 * Implement your connectWallet method here
	 */
	const connectWalletAction = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) return alert("Get MetaMask!");
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});
			console.log("Connected", accounts[0]);
			currentAccount = accounts[0];
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		checkIfWalletIsConnected();
	});

	$: currentAccount, fetchMetadata();

	const fetchMetadata = async () => {
		if (!currentAccount) return;
		console.log("Checking for Character NFT on address:", currentAccount);
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const gameContract = new ethers.Contract(
			CONTRACT_ADDRESS,
			MyEpicGame.abi,
			signer
		);
		const txn = await gameContract.checkIfUserHasNFT();
		if (txn.name) {
			console.log("User has character NFT");
			characterNFT = transformCharacterData(txn);
			console.log(characterNFT)
		} else {
			console.log("No character NFT found");
		}
	};

	const handleCharacterNFT = (nft) => {
		characterNFT = nft;
	}
</script>

<div class="app">
	<div class="container">
		<div class="header-container">
			<p class="header gradient-text">😈 Issekai Demon Slayer 😈</p>
			<p class="sub-text">Team up to protect the realm!</p>
		</div>
		<div class="content-container">
			{#if !currentAccount}
				<div class="connect-wallet-container" on:click={connectWalletAction}>
					Connect Wallet
				</div>
			{:else if currentAccount && !characterNFT}
				<CharacterSelect setCharacterNFT={handleCharacterNFT} />
			{:else}
				<BattleArena characterNFT={characterNFT} />
			{/if}
		</div>
		<div class="footer-container">
			<a
				class="footer-text"
				href="https://twitter.com/sayamqazi"
				target="_blank"
				rel="noreferrer">built by @sayamqazi</a
			>
		</div>
	</div>
</div>

<style>
	.app {
		position: fixed;
		inset: 0;
		background: linear-gradient(#28313b, #485461);
		text-align: center;
	}

	.container {
		height: 100%;
		background-color: #0d1116;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.header-container {
		padding-top: 30px;
	}

	.header {
		margin: 0;
		font-size: 50px;
		font-weight: bold;
		color: white;
	}

	.sub-text {
		font-size: 25px;
		color: white;
	}

	.content-container {
		background-color: rgba(255, 255, 255, 0.05);
	}
	.connect-wallet-container {
		color: black;
		background-color: white;
		padding: 10px 15px;
		margin: 30px auto;
		border-radius: 5px;
		max-width: 220px;
		font-weight: bold;
		cursor: pointer;
	}

	/* 
	.mint-button {
		background: -webkit-linear-gradient(left, #a200d6, #ff6fdf);
		background-size: 200% 200%;
		animation: gradient-animation 4s ease infinite;
		margin-right: 15px;
	}

	.opensea-button {
		background-color: rgb(32, 129, 226);
	}

	.mint-count {
		color: white;
		font-size: 18px;
		font-weight: bold;
	} */

	.footer-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: 30px;
	}

	.footer-text {
		color: white;
		font-size: 16px;
		font-weight: bold;
	}

	/* KeyFrames */
	@-webkit-keyframes gradient-animation {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	@-moz-keyframes gradient-animation {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	@keyframes gradient-animation {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
