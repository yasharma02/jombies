var ZombieFactory = artifacts.require("../Contracts/zombiefactory.sol");
module.exports = function(deployer) {
  deployer.deploy(ZombieFactory);
};

// 1_initial_migration.js for Migrations.sol