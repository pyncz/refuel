# @pyncz/refuel
⛽ Don't let your account run out of fuel

![refuel cover](./.github/cover.jpg)

---

## How it works

### The Problem

It's always sad when your balance of native network token runs out, and you can't send any transaction anymore. You **do** have some assets in non-native token but still can't exchange it because you **don't have enough amount of the native token to pay for the gas**!

So, you need to top up the balance via some bridge with other network or, even worse, use a fiat gateway!

🤯 🤯 🤯


### The Solution

With **`refuel`** you won't have to worry about your balance anymore! When the balance is about to run out, refuel will replenish it by swapping required amount from the token of your choice.


### Okay, but what's going on exactly?

- User selects the source token, the watched token, the threshold and the amount to replenish.
- Refuel submits a gelato task which would execute the swap if the balance of the watched token reached the threshold.
  - Resolver is a Web3Function or a contract
  - Swap is a contract. Gelato automate contract is only who allowed to exec its swap method. It uses uniswap v3 under the hood.
- User sees all their tasks (filter only Refuel-created?) and can cancel / add another one at any time.
