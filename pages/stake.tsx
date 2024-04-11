import {
  Web3Button,
  useAddress,
  useContract,
  useOwnedNFTs,
  useTokenBalance,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import {
  ERC720_CONTRACT_ADDRESS,
  ERC721_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ADDRESS,
} from "../const/addresses";
import StakeNFTGrid from "../components/stake-nft-grid";
import StakedNFTContainer from "../components/staked-nft-container";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Stake() {
  const address = useAddress();
  const [claimableReward, setClaimableReward] = useState<BigNumber>();

  const { contract: ERC721Contract } = useContract(
    ERC721_CONTRACT_ADDRESS,
    "nft-drop"
  );
  const { contract: StakeContract } = useContract(STAKING_CONTRACT_ADDRESS);
  const { contract: ERC20Contract } = useContract(ERC720_CONTRACT_ADDRESS);

  const { data: ownedERC721Tokens, isLoading: ownedERC721TokensIsLoading } =
    useOwnedNFTs(ERC721Contract, address);

  const { data: ERC20TokenBalance, isLoading: ERC20TokenBalanceIsLoading } =
    useTokenBalance(ERC20Contract, address);

  useEffect(() => {
    if (!address || !StakeContract) return;

    async function getClaimableReward() {
      const claimableReward = await StakeContract?.call("getStakeInfo", [
        address,
      ]);

      setClaimableReward(claimableReward[1]);
    }

    getClaimableReward();
  }, [address, StakeContract]);

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1 className={styles.gradientText2}>Stake and Earn</h1>
        <h3 className={styles.heading_para}>Stake your ERC721 NFT and earn an ERC20 token as a reward.</h3>
      </div>
      <div className={styles.stakeRewardContainer}>
        <div className={styles.stakeRewardInfo}>
          <h3>Rewards</h3>
          <p>
            Account Balance:{" "}
            {!ERC20TokenBalanceIsLoading ? (
              <>{ERC20TokenBalance?.displayValue}</>
            ) : (
              <>0</>
            )}
          </p>
        </div>
        <div className={styles.stakeClaimableRewardInfo}>
          <p>Claimable Rewards:</p>
          <p className={styles.claimableRewards}>
            {!claimableReward ? "0" : ethers.utils.formatEther(claimableReward)}
          </p>
          <Web3Button
            contractAddress={STAKING_CONTRACT_ADDRESS}
            action={(contract) => contract.call("claimRewards")}
            className={styles.Button1}
            onSuccess={() => {
              alert("Claimed Rewards");
              setClaimableReward(ethers.constants.Zero);
            }}
            isDisabled={!claimableReward || claimableReward.isZero()}
          >
            Claim Rewards
          </Web3Button>
        </div>
      </div>
      <div className={styles.stakeContainer}>
        <StakeNFTGrid
          isLoading={ownedERC721TokensIsLoading}
          data={ownedERC721Tokens}
        />
        <StakedNFTContainer />
      </div>
    </div>
  );
}
