const log = (input,amount = 1) => {
  for (let i = 0; i < amount; i++) {
    console.log(input);
  }
}

const getIsDeployer = (name, deployer) => {
if (name.signer.address == deployer.address){
    log("correct deployer") 
} else {
    log("incorrect deployer")
  }
}


module.exports = {getIsDeployer,log}