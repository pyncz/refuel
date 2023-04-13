export const erc20Abi = [
  // IERC20
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',

  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)',

  // ERC20
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)',

  'function increaseAllowance(address spender, uint256 addedValue) public returns (bool)',
  'function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool)',
]

export const testUsdtAbi = [
  'function issue(uint amount)',
  ...erc20Abi,
]
