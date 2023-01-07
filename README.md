# Yeniden Giriş (Re-entrancy) Atağı
Bu proje, iki temel staking smart contract'ı (bunlardan biri yeniden giriş saldırısına açık) ve bir atak (saldırı) smart contract'ı içerir. Test dosyası, güvenlik önemini gösterir.

<!---Bu proje [bu makalede](https://scdevstr.substack.com/p/re-entrancy-yeniden-giris-atag) (Türkçe) kullanılmak üzere geliştirilmiştir.-->
Yerel Olarak Çalıştırma
Bu projeyi kullanmaya başlamak için, bu repo'yu klonlayın ve aşağıdaki komutları terminalinizde çalıştırın:

Projeyi klonlayın
```bash
  git clone git clone https://github.com/SCDEVSTR/yeniden-giris-atagi.git
```

Proje dizinine gidin
```bash
  cd yeniden-giris-atagi
```

Bağımlılıkları yükleyin
```bash
  yarn install
```

Test edin
```bash
  npx hardhat test test/Attack.js
```
Benzer bir çıktı görmelisiniz.

```bash
  Re-entrancy Attack
User1 deposited 5 ETH to VulnerableStaking.
User2 deposited 5 ETH to VulnerableStaking.
VulnerableStaking has 10 ETH now.
Attacker will attack to VulnerableStaking now.
ETH balance of Staking Contract is 0.0
    ✔ Should hack vulnerable staking contract
User1 deposited 5 ETH to SafeStaking.
User2 deposited 5 ETH to SafeStaking.
SafeStaking has 10 ETH now.
Attacker will attack to VulnerableStaking now.
ETH balance of Staking Contract is 10.0
    ✔ Should NOT hack safe staking contract

  2 passing
  ```

test/Attack.js dosyasını kontrol edip değiştirerek farklı senaryolar deneyebilirsiniz.



