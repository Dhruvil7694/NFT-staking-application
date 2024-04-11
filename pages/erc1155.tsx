import {
  MediaRenderer,
  Web3Button,
  useActiveClaimCondition,
  useAddress,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";
import { ERC1155_CONTRACT_ADDRESS } from "../const/addresses";
import styles from "../styles/Home.module.css";

export default function ERC1155() {
  const address = useAddress();

  const { contract: ERC1155Contract } = useContract(
    ERC1155_CONTRACT_ADDRESS,
    "edition-drop"
  );

  const {
    data: ERC1155ContractMetadata,
    isLoading: ERC1155ContractMetadataIsLoading,
  } = useContractMetadata(ERC1155Contract);

  const { data: ERC1155ClaimCondition } = useActiveClaimCondition(
    ERC1155Contract,
    0
  );

  return (
    <div className={styles.container}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContainerData}>
          <h1 className={styles.gradientText3}>ERC1155 Claim</h1>
          <p>
            Claim your an ERC1155 token. Claimable with the ERC20 token earned
            from staking your ERC721.
          </p>
          <p>
            Cost: {ERC1155ClaimCondition?.currencyMetadata.displayValue}{" "}
            {ERC1155ClaimCondition?.currencyMetadata.symbol}
          </p>
          {address ? (
            <Web3Button
              contractAddress={ERC1155_CONTRACT_ADDRESS}
              action={(contract) => contract.erc1155.claim(0, 1)}
              onSuccess={() => alert("Claimed NFT")}
              className={styles.Button1}
            >
              Claim NFT
            </Web3Button>
          ) : (
            <p>Connect to claim</p>
          )}
        </div>
        <div className={styles.heroImageContainer}>
          {!ERC1155ContractMetadataIsLoading ? (
            <div className={styles.heroImage}>
              <MediaRenderer
                src={ERC1155ContractMetadata?.image}
                height="100%"
                width="100%"
                className={styles.heroImageimg}
              />
              {/* <p>{ERC1155ContractMetadata?.name}</p> */}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
