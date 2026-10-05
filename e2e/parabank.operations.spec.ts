import { test } from '@playwright/test';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { operationTestData } from '../test-data/operationTestData';

let newAccountId: string | null | undefined;
let fromAccountId: string | null | undefined;

test.beforeEach(async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
});

test('Opens a new banking account', async ({ page }) => {
  const accountPage = new OpenNewAccountPage(page);
  await accountPage.goTo();
  await accountPage.selectAccountType(operationTestData.account.checking.value);
  await page.waitForLoadState('networkidle');
  await accountPage.submitAccountForm();
  const createdAccountId = await accountPage.getNewAccountId();
  newAccountId = createdAccountId;
  if (createdAccountId == null) {
    throw new Error('New account ID was not returned');
  }
  await accountPage.verifyAccountCreation(createdAccountId);
});

test('Transfer funds between own banking accounts', async ({ page }) => {
  const targetAccountId = newAccountId;
  if (targetAccountId == null) {
    test.skip(true, 'Skipping test because newAccountId is not set');
    return;
  }
  const transferPage = new TransferFundsPage(page);
  await transferPage.goTo();
  let transferAmout = operationTestData.transfer.amount;
  fromAccountId = await transferPage.getFromAccountId();
  if (fromAccountId == null) {
    throw new Error('Source account ID was not returned');
  }
  await transferPage.fillTransferDetails(transferAmout, targetAccountId);
  await page.waitForLoadState('networkidle');
  await transferPage.submitTransfer();
  await transferPage.verifyTransferSuccess(transferAmout, fromAccountId, targetAccountId);
});