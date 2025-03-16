const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Helper Functions
function sha256(data) {
  return crypto.createHash('sha256').update(data, 'hex').digest();
}

function ripemd160(data) {
  return crypto.createHash('ripemd160').update(data).digest('hex');
}

// ===== Exercise 1: P2PKH =====
const keyPair = ec.genKeyPair();
const privateKey = keyPair.getPrivate('hex');
const publicKey = keyPair.getPublic('hex');
const pubKeyHash = ripemd160(sha256(publicKey));

console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
console.log('Public Key Hash:', pubKeyHash);

function p2pkhScript(pubKey, signature) {
  const stack = [];
  stack.push(signature);
  stack.push(pubKey);
  const duplicatedPubKey = stack[stack.length - 1];
  stack.push(duplicatedPubKey);
  const hashedPubKey = ripemd160(sha256(stack.pop()));
  if (hashedPubKey !== pubKeyHash) {
    console.log('Public key hash does not match.');
    return false;
  }
  if (signature === 'dummy_signature') {
    console.log('Signature verified.');
    return true;
  } else {
    console.log('Invalid signature.');
    return false;
  }
}

const dummySignature = 'dummy_signature';
const p2pkhResult = p2pkhScript(publicKey, dummySignature);
console.log('P2PKH Script Execution Result:', p2pkhResult);

// ===== Exercise 2: 2-of-3 Multisig =====
// Step 1: Generate 3 keypairs
const keyPairs = Array.from({ length: 3 }, () => ec.genKeyPair());
const privateKeys = keyPairs.map(kp => kp.getPrivate('hex'));
const pubKeys = keyPairs.map(kp => kp.getPublic('hex'));

console.log('Private Keys:', privateKeys);
console.log('Public Keys:', pubKeys);

// Step 2: Simulate multisig script
const signatures = ['sig1', 'sig2']; // Dummy signatures

function multisigScript(signatures, pubKeys, requiredSigs = 2) {
  let validSigs = 0;
  let sigIndex = 0;
  let pubKeyIndex = 0;

  while (sigIndex < signatures.length && pubKeyIndex < pubKeys.length) {
    const sig = signatures[sigIndex];
    const pubKey = pubKeys[pubKeyIndex];
    console.log(`Checking signature ${sig} with public key ${pubKey}`);

    if (sig.startsWith('sig')) {
      validSigs++;
      sigIndex++;
    }
    pubKeyIndex++;
  }

  if (validSigs >= requiredSigs) {
    console.log(`${validSigs} signatures verified.`);
    return true;
  } else {
    console.log('Not enough valid signatures.');
    return false;
  }
}

const multisigResult = multisigScript(signatures, pubKeys);
console.log('Multisig Script Execution Result:', multisigResult);

function simulateSpending(signatures, pubKeys, requiredSigs = 2) {
    console.log('\nSimulating Spending...');
    const result = multisigScript(signatures, pubKeys, requiredSigs);
    if (result) {
      console.log('Transaction successfully spent with 2 valid signatures!');
    } else {
      console.log('Failed to spend transaction: Not enough valid signatures.');
    }
    return result;
  }
  
  // Simulate spending with 2 valid signatures
  simulateSpending(['sig1', 'sig3'], pubKeys)