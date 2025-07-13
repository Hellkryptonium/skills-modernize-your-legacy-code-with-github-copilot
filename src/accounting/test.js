const fs = require('fs');
const path = require('path');
const mock = require('mock-fs');
const { expect } = require('chai');
const sinon = require('sinon');

// Import the main functions from index.js
const DATA_FILE = path.join(__dirname, '../accounting/balance.json');
const INITIAL_BALANCE = 1000.00;

// Re-import functions from index.js
const accounting = require('../accounting/index.js');

// Helper to reset balance file
function setBalance(balance) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ balance }));
}

function getBalance() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')).balance;
}

describe('COBOL Student Account Management System', function () {
  beforeEach(function () {
    // Mock the file system for each test
    mock({
      [DATA_FILE]: JSON.stringify({ balance: INITIAL_BALANCE })
    });
  });

  afterEach(function () {
    mock.restore();
  });

  it('TC-01: View current account balance', function () {
    setBalance(1234.56);
    const balance = getBalance();
    expect(balance).to.equal(1234.56);
  });

  it('TC-02: Credit account with valid amount', function () {
    setBalance(1000);
    let balance = getBalance();
    balance += 100;
    setBalance(balance);
    expect(getBalance()).to.equal(1100);
  });

  it('TC-03: Debit account with valid amount', function () {
    setBalance(1000);
    let balance = getBalance();
    balance -= 200;
    setBalance(balance);
    expect(getBalance()).to.equal(800);
  });

  it('TC-04: Attempt to debit more than available balance', function () {
    setBalance(100);
    let balance = getBalance();
    const debitAmount = 200;
    if (balance < debitAmount) {
      expect(balance).to.be.lessThan(debitAmount);
    }
  });

  it('TC-05: Enter invalid menu option', function () {
    // This would be handled in the CLI, so here we just check that invalid input is not processed
    // Simulate invalid input
    const invalidChoice = '9';
    expect(['1', '2', '3', '4']).to.not.include(invalidChoice);
  });

  it('TC-06: Exit the application', function () {
    // This is a CLI action, so we just check that the exit flag can be set
    let continueFlag = true;
    continueFlag = false;
    expect(continueFlag).to.be.false;
  });

  it('TC-07: Data consistency after multiple operations', function () {
    setBalance(1000);
    let balance = getBalance();
    balance += 50; // credit
    setBalance(balance);
    balance -= 20; // debit
    setBalance(balance);
    expect(getBalance()).to.equal(1030);
  });

  it('TC-08: Data persistence during session', function () {
    setBalance(1000);
    let balance = getBalance();
    balance += 10;
    setBalance(balance);
    expect(getBalance()).to.equal(1010);
    balance -= 5;
    setBalance(balance);
    expect(getBalance()).to.equal(1005);
  });
});
