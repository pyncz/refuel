# refuel
⛽ Don't let your account run out of fuel

> **Warning**
>
> This is my sandbox project to try out Gelato (and Uniswap v3, along the way). Don't take it seriously.

![refuel cover](./.github/cover.jpg)

---

## How it works

### The Problem

It's always sad when your native network token balance runs out, and you can't send any transaction anymore. You **do** have some assets in non-native tokens but still can't exchange them because you **don't have enough amount of the native token to pay for the gas**!

So, you need to top up your balance through a bridge with another network or, even worse, use a fiat gateway!

🤯 🤯 🤯


### The Solution

With **`refuel`** you won't have to worry about your balance anymore! When the balance is about to run out, `refuel` will replenish it by swapping the required amount of a token of your choice.


### Okay, but what's going on exactly?

- User selects
  - the source token
  - the watched token
  - the threshold
  - the amount to replenish
  - the maximum amount of the source token to spend
- `refuel` submits a [gelato](https://www.gelato.network/automate) task
- The task executes a [uniswap v3](https://uniswap.org/) swap if the balance of the watched token gets less than the threshold

User sees all their tasks and can cancel / add another one at any time.

> **Note** Conditions of the task's execution are resolved by the [`RefuelResolver`](./contracts/contracts/RefuelResolver.sol) contract.

> **Note** Swap is provided by the [`Refuel`](./contracts/contracts/Refuel.sol) contract. Gelato automation contract is the only who allowed to exec its `execute` method.
