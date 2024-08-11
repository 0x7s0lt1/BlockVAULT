
import { FC } from "react";


const ConnectWallet : FC = () => {

    return (
        <>
            <section className="crt-vlt-wrapper">
                <div className="card">
                    <h1 className="card-text">
                        Please connect your wallet.
                    </h1>
                    <w3m-button balance="hide" size="md"/>
                </div>
            </section>
        </>
    )
}

export default ConnectWallet;