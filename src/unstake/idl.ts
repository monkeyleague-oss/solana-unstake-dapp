export type MonkeyStaking = {
  version: "1.0.0";
  name: "monkey_staking";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakingAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "initializer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "stakingAccountBump";
          type: "u8";
        },
        {
          name: "lockEndDate";
          type: "u64";
        },
        {
          name: "tokenMintKey";
          type: "publicKey";
        }
      ];
    },
    {
      name: "updateLockEndDate";
      accounts: [
        {
          name: "initializer";
          isMut: false;
          isSigner: true;
        },
        {
          name: "stakingAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "stakingAccountBump";
          type: "u8";
        },
        {
          name: "newLockEndDate";
          type: "u64";
        }
      ];
    },
    {
      name: "toggleFreezeProgram";
      accounts: [
        {
          name: "initializer";
          isMut: false;
          isSigner: true;
        },
        {
          name: "stakingAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "stakingAccountBump";
          type: "u8";
        }
      ];
    },
    {
      name: "stake";
      accounts: [
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenFrom";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenFromAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakingAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userStakingAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "stakingAccountBump";
          type: "u8";
        },
        {
          name: "userStakingBump";
          type: "u8";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "unstake";
      accounts: [
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
        {
          name: "stakingAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userStakingAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenTo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "stakingAccountBump";
          type: "u8";
        },
        {
          name: "userStakingBump";
          type: "u8";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "emitPrice";
      accounts: [
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stakingAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "emitReward";
      accounts: [
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenVault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stakingAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenFromAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "userStakingAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "StakingAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "vaultBump";
            type: "u8";
          },
          {
            name: "initializerKey";
            type: "publicKey";
          },
          {
            name: "lockEndDate";
            type: "u64";
          },
          {
            name: "totalPoolShares";
            type: "u64";
          },
          {
            name: "freezeProgram";
            type: "bool";
          },
          {
            name: "tokenMintKey";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "UserStakingAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "poolSharesAmount";
            type: "u64";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "PriceChange";
      fields: [
        {
          name: "oldTokenPerPoolShareE9";
          type: "u64";
          index: false;
        },
        {
          name: "oldTokenPerPoolShare";
          type: "string";
          index: false;
        },
        {
          name: "newTokenPerPoolShareE9";
          type: "u64";
          index: false;
        },
        {
          name: "newTokenPerPoolShare";
          type: "string";
          index: false;
        }
      ];
    },
    {
      name: "Price";
      fields: [
        {
          name: "tokenPerPoolShareE9";
          type: "u64";
          index: false;
        },
        {
          name: "tokenPerPoolShare";
          type: "string";
          index: false;
        }
      ];
    },
    {
      name: "Reward";
      fields: [
        {
          name: "deposit";
          type: "u64";
          index: false;
        },
        {
          name: "reward";
          type: "u64";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "NotExceedLockEndDate";
      msg: "Not exceed lock end date";
    },
    {
      code: 6001;
      name: "IncorrectStakingAccountBump";
      msg: "Incorrect staking_account_bump";
    },
    {
      code: 6002;
      name: "ProgramIsFrozen";
      msg: "Program is frozen. Check back later";
    },
    {
      code: 6003;
      name: "Forbidden";
      msg: "Forbidden";
    },
    {
      code: 6004;
      name: "NotEnoughShares";
      msg: "User account has less shares than requested amount";
    }
  ];
};

export const IDL: MonkeyStaking = {
  version: "1.0.0",
  name: "monkey_staking",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakingAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "stakingAccountBump",
          type: "u8",
        },
        {
          name: "lockEndDate",
          type: "u64",
        },
        {
          name: "tokenMintKey",
          type: "publicKey",
        },
      ],
    },
    {
      name: "updateLockEndDate",
      accounts: [
        {
          name: "initializer",
          isMut: false,
          isSigner: true,
        },
        {
          name: "stakingAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "stakingAccountBump",
          type: "u8",
        },
        {
          name: "newLockEndDate",
          type: "u64",
        },
      ],
    },
    {
      name: "toggleFreezeProgram",
      accounts: [
        {
          name: "initializer",
          isMut: false,
          isSigner: true,
        },
        {
          name: "stakingAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "stakingAccountBump",
          type: "u8",
        },
      ],
    },
    {
      name: "stake",
      accounts: [
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenFrom",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenFromAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakingAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userStakingAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "stakingAccountBump",
          type: "u8",
        },
        {
          name: "userStakingBump",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "unstake",
      accounts: [
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
        {
          name: "stakingAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userStakingAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenTo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "stakingAccountBump",
          type: "u8",
        },
        {
          name: "userStakingBump",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "emitPrice",
      accounts: [
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stakingAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "emitReward",
      accounts: [
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenVault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stakingAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenFromAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userStakingAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "StakingAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "vaultBump",
            type: "u8",
          },
          {
            name: "initializerKey",
            type: "publicKey",
          },
          {
            name: "lockEndDate",
            type: "u64",
          },
          {
            name: "totalPoolShares",
            type: "u64",
          },
          {
            name: "freezeProgram",
            type: "bool",
          },
          {
            name: "tokenMintKey",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "UserStakingAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "poolSharesAmount",
            type: "u64",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "PriceChange",
      fields: [
        {
          name: "oldTokenPerPoolShareE9",
          type: "u64",
          index: false,
        },
        {
          name: "oldTokenPerPoolShare",
          type: "string",
          index: false,
        },
        {
          name: "newTokenPerPoolShareE9",
          type: "u64",
          index: false,
        },
        {
          name: "newTokenPerPoolShare",
          type: "string",
          index: false,
        },
      ],
    },
    {
      name: "Price",
      fields: [
        {
          name: "tokenPerPoolShareE9",
          type: "u64",
          index: false,
        },
        {
          name: "tokenPerPoolShare",
          type: "string",
          index: false,
        },
      ],
    },
    {
      name: "Reward",
      fields: [
        {
          name: "deposit",
          type: "u64",
          index: false,
        },
        {
          name: "reward",
          type: "u64",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "NotExceedLockEndDate",
      msg: "Not exceed lock end date",
    },
    {
      code: 6001,
      name: "IncorrectStakingAccountBump",
      msg: "Incorrect staking_account_bump",
    },
    {
      code: 6002,
      name: "ProgramIsFrozen",
      msg: "Program is frozen. Check back later",
    },
    {
      code: 6003,
      name: "Forbidden",
      msg: "Forbidden",
    },
    {
      code: 6004,
      name: "NotEnoughShares",
      msg: "User account has less shares than requested amount",
    },
  ],
};
