import React, { useState, useEffect, useContext } from "react";
import Link from 'next/link'
import { shortAddress } from "../utils";
import makeBlockie from 'ethereum-blockies-base64';
import useDidToAddress from "../hooks/useDidToAddress";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';

/* Edit this data to support your domain name */
const resolverAddress = "0xF20fc12a4955c9d47194B8fEd591Fe01777D2b06"; // find it here for your chain: https://docs.punk.domains/addresses/resolver-addresses/
const domainExtension = ".op";
const rpcNodes = {
  10: "https://mainnet.optimism.io" // make sure you have the correct chain ID and RPC URL
}
/* END */

export function User({details, accounts, isLink = true, size = "md", showBadge = true}) {
  const { address } = useDidToAddress(details?.did);
  const [username, setUsername] = useState(0);

  /** Load domain names */
  useEffect(() => {
    getDomainOrAddress();
  }, [address]);

  /** Returns a valid provider to use to connect the user's wallet */
  async function getProvider() {
    let provider = null;

    if(window.ethereum) {
      provider = window.ethereum;

      /** Return provider to use */
      return provider;
    } else {
      /** Create WalletConnect Provider */
      provider = new WalletConnectProvider({
        rpc: rpcNodes
      });

      /** Enable session (triggers QR Code modal) */
      await provider.enable();

      /** Return provider to use */
      return provider;
    }
  }

  async function getDomainOrAddress() {
    const userStoredDomain = await sessionStorage.getItem(address);

    if (userStoredDomain) {
      console.log("storage call");
      setUsername(userStoredDomain);
    } else {
      console.log(address);
      let provider = await getProvider();
      const web3Provider = new ethers.providers.Web3Provider(provider);

      const itrfc = new ethers.utils.Interface([
        "function getDefaultDomain(address _addr, string calldata _tld) public view returns(string memory)"
      ]);

      const resolverContract = new ethers.Contract(resolverAddress, itrfc, web3Provider);

      const userDomain = await resolverContract.getDefaultDomain(address, domainExtension);

      if (userDomain) {
        console.log(userDomain);
        const fullDomain = userDomain + domainExtension;
        sessionStorage.setItem(address, fullDomain); // store in session storage to reduce blockchain calls
        setUsername(fullDomain);
      } else if(address) {
        sessionStorage.setItem(address, shortAddress(address)); // store in session storage to reduce blockchain calls
        setUsername(shortAddress(address));
      } else {
        sessionStorage.setItem(address, shortAddress(details?.did)); // store in session storage to reduce blockchain calls
        setUsername(shortAddress(details?.did));
      }

    }
  }

  if(!details) {
    return null;
  }

  return(
    <div className={"user-container " + size}>
      <PfP details={details} />
      <div className="user-details-container">
        <div className="name">
          {isLink ?
            <a href={"https://orbis.club/profile/" + details.did} target="_blank" rel="noreferrer">{username}</a>
          :
            <>{username}</>
          }

        </div>
        {/** Show badge if needed */}
        {showBadge &&
          <div className="badge black">{details.metadata?.ensName ? details.metadata.ensName : shortAddress(address)}</div>
        }
        </div>
    </div>
  )
}

export function PfP({details}) {
  const { address } = useDidToAddress(details?.did);

  if(!details) {
    return null;
  }

  /** Show profile badges */
  const ProfileBadges = () => {
    return(
      <div className="badges-container">
        {details.profile?.isHuman &&
          <div>
            <img src="/img/icons/human-verified.png" />
          </div>
        }
        {details.profile?.pfpIsNft &&
          <div>
            <img src={"/img/icons/nft-verified-"+details.profile?.pfpIsNft.chain+".png"} />
          </div>
        }
      </div>
    );
  }

  const PfpImg = () => {
    if(details.profile?.pfp) {
      return <img src={details.profile?.pfp} className="pfp" />
    } else if(address) {
      return <img src={makeBlockie(address)} className="pfp" />
    } else {
      return <img src="/img/empty-state.png" className="pfp" />;
    }
  }

  return(
    <div className="pfp-container">
      {/** Show profile picture image */}
      <PfpImg />

      {/** Show profile badges such as PoH and verified NFTs */}
      <ProfileBadges />
    </div>
  )
}
