export const operationTestData = {
  baseUrl: 'https://parabank.parasoft.com/parabank/index.htm',
  account: {
    checking: { value: '0', label: 'CHECKING' },
    savings: { value: '1', label: 'SAVINGS' },
  },
  transfer: {
    amount: '100',
  },
} as const;