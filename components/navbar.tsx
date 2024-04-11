import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import randomColor from "../util/randomColor";
import { useState } from "react";


const [randomColor1, randomColor2] = [randomColor(), randomColor()];

export default function Navbar() {
  const address = useAddress();
  const disconnect = useDisconnect();

  function truncateAddress(address: string) {
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  }

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className={styles.navbarContainer}>
      <Link href="/">
      <p className={styles.navbarLogo}>Stake NFT</p>
      </Link>
      <div className={styles.navbarLinks}>
        <Link href={"/erc1155"}>
          <p>ERC1155</p>
        </Link>
        <Link href={"/about"}>
          <p>About</p>
        </Link>
        <Link href={"/stake"}>
          <p>Stake</p>
        </Link>
        <Link href={"https://opensea.io/"}>
          <p>Marketplace</p>
        </Link>
      </div>
      <div>
        {address ? (
          <>
            <div
              className={styles.profilePicture}
              style={{
                background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
              }}
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
              }}
            />
            {profileMenuOpen && (
              <div className={styles.profileMenu}>
                <p className={styles.profileMenuAddress}>
                  {truncateAddress(address)}
                </p>
                <Link
                  href={`/profile/${address}`}
                  onClick={() => {
                    setProfileMenuOpen(false);
                  }}
                >
                  <p className={styles.profileMenuLink}>Profile</p>
                </Link>
                <hr className={styles.divider} />
                <button
                  className={styles.Button1}
                  onClick={() => {
                    disconnect();
                    setProfileMenuOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </>
        ) : (
          <ConnectWallet btnTitle="Login" modalTitle="Login" />
        )}
      </div>
    </div>
  );
}
