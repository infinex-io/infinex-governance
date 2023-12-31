const { ethers } = hre;
const assertBn = require('@synthetixio/core-js/utils/assertions/assert-bignumber');
const assertRevert = require('@synthetixio/core-js/utils/assertions/assert-revert');
const { bootstrap } = require('@synthetixio/deployer/utils/tests');
const initializer = require('@synthetixio/core-modules/test/helpers/initializer');

describe('TokenModule', () => {
  const { proxyAddress } = bootstrap(initializer, { modules: '.*(Owner|Upgrade|Token).*' });

  let TokenModule;
  let owner, userMint, userBurn;

  before('identify signers', async () => {
    [owner, userMint, userBurn] = await ethers.getSigners();
  });

  before('identify modules', async () => {
    TokenModule = await ethers.getContractAt('TokenModule', proxyAddress());
  });

  describe('mint()', () => {
    it('reverts when not owner', async () => {
      await assertRevert(TokenModule.connect(userMint).mint(userMint.address, 42), 'Unauthorized');
    });

    it('mints', async () => {
      await TokenModule.connect(owner).mint(userMint.address, 42);
      assertBn.equal(await TokenModule.balanceOf(userMint.address), 42);
    });
  });

  describe('burn()', () => {
    before(async () => {
      await TokenModule.connect(owner).mint(userBurn.address, 42);
    });

    it('reverts when not owner', async () => {
      await assertRevert(TokenModule.connect(userBurn).burn(userBurn.address, 21), 'Unauthorized');
    });

    it('burns', async () => {
      await TokenModule.connect(owner).burn(userBurn.address, 21);
      assertBn.equal(await TokenModule.balanceOf(userBurn.address), 21);
    });
  });
});
