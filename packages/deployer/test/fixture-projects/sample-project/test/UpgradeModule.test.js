const hre = require('hardhat');
const assert = require('assert');
const { ethers } = hre;
const { getProxyAddress, getRouterAddress } = require('@synthetixio/deployer/utils/deployments');
const { assertRevert } = require('@synthetixio/core-js/utils/assertions');
const bootstrap = require('./helpers/bootstrap');

describe('UpgradeModule', () => {
  const { deploymentInfo, initSystem } = bootstrap();

  let UpgradeModule, OwnerModule;

  let owner, user;
  let proxyAddress, routerAddress;

  before('initialize the system', async () => {
    await initSystem();
  });

  before('identify signers', async () => {
    [owner, user] = await ethers.getSigners();
  });

  before('identify modules', async () => {
    routerAddress = getRouterAddress(deploymentInfo);
    proxyAddress = getProxyAddress(deploymentInfo);

    UpgradeModule = await ethers.getContractAt('UpgradeModule', proxyAddress);
    OwnerModule = await ethers.getContractAt('OwnerModule', proxyAddress);
  });

  describe('when the system is deployed', () => {
    it('shows that the current implementation is correct', async () => {
      assert.equal(await UpgradeModule.getImplementation(), routerAddress);
    });
  });

  describe('when a regular user attempts to upgrade the system', () => {
    it('reverts', async () => {
      await assertRevert(
        UpgradeModule.connect(user).upgradeTo(user.address),
        'Only owner can invoke'
      );
    });
  });

  // Skipped until Issue #226 is resolved. Details there.
  describe.skip('when attempting to destroy the implementation with a malicious contract', () => {
    let destroyer;

    let OwnerModuleImpl, UpgradeModuleImpl;

    before('deploy the malicious contract', async () => {
      const factory = await ethers.getContractFactory('Destroyer');
      destroyer = await factory.deploy();
    });

    before('identify implementation modules', async () => {
      OwnerModuleImpl = await ethers.getContractAt('OwnerModule', routerAddress);
      UpgradeModuleImpl = await ethers.getContractAt('UpgradeModule', routerAddress);
    });

    it('shows that the owner of the implementation is address(0)', async () => {
      assert.equal(await OwnerModuleImpl.owner(), '0x0000000000000000000000000000000000000000');
    });

    it('shows that the implementation of the implementation is address(0)', async () => {
      assert.equal(
        await UpgradeModuleImpl.getImplementation(),
        '0x0000000000000000000000000000000000000000'
      );
    });

    describe('when owning the implementation', () => {
      before('own the implementation', async function () {
        let tx;

        tx = await OwnerModuleImpl.connect(user).nominateNewOwner(user.address);
        await tx.wait();

        tx = await OwnerModuleImpl.connect(user).acceptOwnership();
        await tx.wait();
      });

      it('shows that the user is now the owner of the implementation', async () => {
        assert.equal(await OwnerModuleImpl.owner(), user.address);
      });

      describe('when trying to upgrade the implementation of the implementation to the destroyer', () => {
        it('reverts', async () => {
          await assertRevert(
            UpgradeModuleImpl.connect(user).upgradeTo(destroyer.address),
            'Implementation is sterile'
          );
        });

        it('shows that the code of the implementation is not null', async () => {
          const code = await ethers.provider.getCode(routerAddress);

          assert.notEqual(code, '0x');
        });

        it('shows that the proxy is still responsive', async () => {
          assert.equal(await OwnerModule.owner(), owner.address);
        });
      });
    });
  });
});
