# ModArith Playground

**An Interactive Toolkit for Number Theory and Public-Key Cryptography**

ModArith Playground is a client-side educational laboratory designed for students, mathematics educators, and curious learners exploring Discrete Mathematics, Modular Arithmetic, and Public-Key Cryptography.

## Features

- **Number Basics**:
  - **Greatest Common Factor & Clock Inverse Finder**: Step-by-step Extended Euclidean Algorithm, Bézout's Identity, and modular inverse solver.
- **Number Puzzles**:
  - **Remainder Puzzle Solver (Chinese Remainder Theorem)**: Simultaneous linear congruences with pairwise coprimality checking.
  - **Prime Number Tester & "Fool the Test" Explorer**: Square-and-Multiply binary exponentiation, Fermat's Little Theorem primality test, and Carmichael pseudoprime explorer.
- **Secret Messages**:
  - **Secret Message Maker (RSA Workbench)**: Interactive prime selection, Public Lock / Private Key generation, and live ASCII text encryption and decryption.
  - **Weak Key Breaker (RSA Factorisation Attack)**: Fermat's Difference-of-Squares and Trial Division attack simulator recovering private keys from weak moduli.
- **Share a Secret**:
  - **Public Secret Sharing (Diffie–Hellman Key Exchange)**: Visualizes how Alice and Bob compute an identical shared secret over a public channel.
- **Teacher Guide & Proof Context**:
  - Built-in slide-over guide connecting Unit 1 (Formal Proofs), Unit 2 (Counting & Prime Number Theorem), and Unit 5 (Number Theory).

## Getting Started

```bash
npm install
npm run dev
```

## Running Tests & Production Build

```bash
npm run test -- --run
npm run build
```
