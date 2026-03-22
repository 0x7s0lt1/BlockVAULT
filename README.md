
<h1 align="center">BlockVAULT</h1>
<p align="center">
On-chain secret manager
</p>

This is a secret manager that allows you to store, retrieve, and even share your secrets in a secure and decentralized way.
All items are stored in smart contracts that can be accessed by the owner or by those who have been granted access by the owner.

## 📚 How it works

### 1. Version Manager

The Version Manager is a smart contract used to manage the relationship between vaults and user wallets.
Each supported network must have its own Version Manager contract.

### 2. Vault
A Vault is a smart contract that stores the connection between a user's wallet and their items.
It also functional as a wallet. So tokens can be deposited and withdrawn.
One wallet can have only one Vault per network.

### 3. Item
Items are smart contracts used to store and retrieve secrets.
There are three types of items: Password, Debit Card, and Loyalty Card.
Items are shareable — the owner can grant access to other wallets to retrieve them.


## Solidity
[https://github.com/0x7s0lt1/blockVault.sol](https://github.com/0x7s0lt1/blockVault.sol)

### 🔨 Install
```shell
pnpm i
```
### 🏃 Run
```shell
pnpm dev
```
## Version Managers
<table>
    <thead>
        <tr>
            <th>Network</th>
            <th>Address</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Sepholia</td>
            <td>0x5beebfa04ee5b6c0593e3a7374078b2f66917fcc</td>
        </tr>
        <tr>
            <td>Ethereum</td>
            <td>0x6f4c6487D21920BB9D9f31a9F277E705dC47BB64</td>
        </tr>
        <tr>
            <td>BSC</td>
            <td>0xaf3897d818d5cf36490ef0a282c6232fab8790b4</td>
        </tr>
        <tr>
            <td>Polygon</td>
            <td>0x77cbc128f1eff68c169881c160f9b305a06a64cf</td>
        </tr>
        <tr>
            <td>Arbitrum</td>
            <td>0xC76440DbdB9B42Ae2BF0269D12280614604d43e8</td>
        </tr>
    </tbody>
</table>
