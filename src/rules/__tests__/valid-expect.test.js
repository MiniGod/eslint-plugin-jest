import { RuleTester } from 'eslint';
import rule from '../valid-expect';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 8,
  },
});

ruleTester.run('valid-expect', rule, {
  valid: [
    'expect("something").toEqual("else");',
    'expect(true).toBeDefined();',
    'expect([1, 2, 3]).toEqual([1, 2, 3]);',
    'expect(undefined).not.toBeDefined();',
    'test("valid-expect", () => { return expect(Promise.resolve(2)).resolves.toBeDefined(); });',
    'test("valid-expect", () => { return expect(Promise.reject(2)).rejects.toBeDefined(); });',
    'test("valid-expect", () => { return expect(Promise.resolve(2)).not.resolves.toBeDefined(); });',
    'test("valid-expect", () => { return expect(Promise.resolve(2)).not.rejects.toBeDefined(); });',
    'test("valid-expect", function () { return expect(Promise.resolve(2)).not.resolves.toBeDefined(); });',
    'test("valid-expect", function () { return expect(Promise.resolve(2)).not.rejects.toBeDefined(); });',
    'test("valid-expect", function () { return Promise.resolve(expect(Promise.resolve(2)).not.resolves.toBeDefined()); });',
    'test("valid-expect", function () { return Promise.resolve(expect(Promise.resolve(2)).not.rejects.toBeDefined()); });',
    {
      code:
        'test("valid-expect", () => expect(Promise.resolve(2)).resolves.toBeDefined());',
      options: [{ alwaysAwait: true }],
    },
    'test("valid-expect", () => expect(Promise.resolve(2)).resolves.toBeDefined());',
    'test("valid-expect", () => expect(Promise.reject(2)).rejects.toBeDefined());',
    'test("valid-expect", () => expect(Promise.reject(2)).not.resolves.toBeDefined());',
    'test("valid-expect", () => expect(Promise.reject(2)).not.rejects.toBeDefined());',
    'test("valid-expect", () => expect(Promise.reject(2)).resolves.not.toBeDefined());',
    'test("valid-expect", () => expect(Promise.reject(2)).rejects.not.toBeDefined());',
    'test("valid-expect", async () => { await expect(Promise.reject(2)).not.resolves.toBeDefined(); });',
    'test("valid-expect", async () => { await expect(Promise.reject(2)).not.rejects.toBeDefined(); });',
    'test("valid-expect", async function () { await expect(Promise.reject(2)).not.resolves.toBeDefined(); });',
    'test("valid-expect", async function () { await expect(Promise.reject(2)).not.rejects.toBeDefined(); });',
    'test("valid-expect", async () => { await Promise.resolve(expect(Promise.reject(2)).not.rejects.toBeDefined()); });',
    'test("valid-expect", async () => { await Promise.reject(expect(Promise.reject(2)).not.rejects.toBeDefined()); });',
    'test("valid-expect", async () => { await Promise.all([expect(Promise.reject(2)).not.rejects.toBeDefined(), expect(Promise.reject(2)).not.rejects.toBeDefined()]); });',
    'test("valid-expect", async () => { await Promise.race([expect(Promise.reject(2)).not.rejects.toBeDefined(), expect(Promise.reject(2)).rejects.not.toBeDefined()]); });',
    'test("valid-expect", async () => { await Promise.allSettled([expect(Promise.reject(2)).not.rejects.toBeDefined(), expect(Promise.reject(2)).rejects.not.toBeDefined()]); });',
    'test("valid-expect", async () => { await Promise.any([expect(Promise.reject(2)).not.rejects.toBeDefined(), expect(Promise.reject(2)).rejects.not.toBeDefined()]); });',
    'test("valid-expect", async () => { return expect(Promise.reject(2)).not.resolves.toBeDefined().then(() => console.log("valid-case")); });',
    'test("valid-expect", async () => { return expect(Promise.reject(2)).not.resolves.toBeDefined().then(() => console.log("valid-case")).then(() => console.log("another valid case")); });',
    'test("valid-expect", async () => { return expect(Promise.reject(2)).not.resolves.toBeDefined().catch(() => console.log("valid-case")); });',
    'test("valid-expect", async () => { return expect(Promise.reject(2)).not.resolves.toBeDefined().then(() => console.log("valid-case")).catch(() => console.log("another valid case")); });',
    'test("valid-expect", async () => { return expect(Promise.reject(2)).not.resolves.toBeDefined().then(() => { expect(someMock).toHaveBeenCalledTimes(1); }); });',
    'test("valid-expect", async () => { await expect(Promise.reject(2)).not.resolves.toBeDefined().then(() => console.log("valid-case")); });',
    'test("valid-expect", async () => { await expect(Promise.reject(2)).not.resolves.toBeDefined().then(() => console.log("valid-case")).then(() => console.log("another valid case")); });',
    'test("valid-expect", async () => { await expect(Promise.reject(2)).not.resolves.toBeDefined().catch(() => console.log("valid-case")); });',
    'test("valid-expect", async () => { await expect(Promise.reject(2)).not.resolves.toBeDefined().then(() => console.log("valid-case")).catch(() => console.log("another valid case")); });',
    'test("valid-expect", async () => { await expect(Promise.reject(2)).not.resolves.toBeDefined().then(() => { expect(someMock).toHaveBeenCalledTimes(1); }); });',
    {
      code: `test("valid-expect", () => { 
      return expect(functionReturningAPromise()).resolves.toEqual(1).then(() => {
        return expect(Promise.resolve(2)).resolves.toBe(1);
      });
    });`,
    },
    {
      code: `test("valid-expect", () => { 
      return expect(functionReturningAPromise()).resolves.toEqual(1).then(async () => {
        await expect(Promise.resolve(2)).resolves.toBe(1);
      });
    });`,
    },
    {
      code: `test("valid-expect", () => { 
      return expect(functionReturningAPromise()).resolves.toEqual(1).then(() => expect(Promise.resolve(2)).resolves.toBe(1));
    });`,
    },
  ],

  invalid: [
    {
      code: 'expect().toBe(true);',
      errors: [{ endColumn: 8, column: 7, messageId: 'noArgs' }],
    },
    {
      code: 'expect().toEqual("something");',
      errors: [{ endColumn: 8, column: 7, messageId: 'noArgs' }],
    },
    {
      code: 'expect("something", "else").toEqual("something");',
      errors: [{ endColumn: 26, column: 21, messageId: 'multipleArgs' }],
    },
    {
      code: 'expect("something");',
      errors: [{ endColumn: 20, column: 1, messageId: 'noAssertions' }],
    },
    {
      code: 'expect();',
      errors: [
        { endColumn: 9, column: 1, messageId: 'noAssertions' },
        { endColumn: 8, column: 7, messageId: 'noArgs' },
      ],
    },
    {
      code: 'expect(true).toBeDefined;',
      errors: [
        {
          endColumn: 25,
          column: 14,
          messageId: 'matcherOnPropertyNotCalled',
          data: { propertyName: 'toBeDefined' },
        },
      ],
    },
    {
      code: 'expect(true).not.toBeDefined;',
      errors: [
        {
          endColumn: 29,
          column: 18,
          messageId: 'matcherOnPropertyNotCalled',
          data: { propertyName: 'toBeDefined' },
        },
      ],
    },
    {
      code: 'expect(true).nope.toBeDefined;',
      errors: [
        {
          endColumn: 18,
          column: 14,
          messageId: 'invalidProperty',
          data: { propertyName: 'nope' },
        },
      ],
    },
    {
      code: 'expect(true).resolves;',
      errors: [
        {
          endColumn: 22,
          column: 14,
          messageId: 'propertyWithoutMatcher',
          data: { propertyName: 'resolves' },
        },
      ],
    },
    {
      code: 'expect(true).rejects;',
      errors: [
        {
          endColumn: 21,
          column: 14,
          messageId: 'propertyWithoutMatcher',
          data: { propertyName: 'rejects' },
        },
      ],
    },
    {
      code: 'expect(true).not;',
      errors: [
        {
          endColumn: 17,
          column: 14,
          messageId: 'propertyWithoutMatcher',
          data: { propertyName: 'not' },
        },
      ],
    },
    /**
     * .resolves & .rejects checks
     */
    // Inline usages
    {
      code: 'expect(Promise.resolve(2)).resolves.toBeDefined();',
      errors: [
        {
          column: 1,
          endColumn: 50,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    {
      code: 'expect(Promise.resolve(2)).rejects.toBeDefined();',
      errors: [
        {
          column: 1,
          endColumn: 49,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // alwaysAwait option changes error message
    {
      code: 'expect(Promise.resolve(2)).resolves.toBeDefined();',
      options: [{ alwaysAwait: true }],
      errors: [
        {
          column: 1,
          endColumn: 50,
          messageId: 'asyncMustBeAwaited',
        },
      ],
    },

    // expect().resolves
    {
      code:
        'test("valid-expect", () => { expect(Promise.resolve(2)).resolves.toBeDefined(); });',
      errors: [
        {
          column: 30,
          endColumn: 79,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // expect().not.resolves
    {
      code:
        'test("valid-expect", () => { expect(Promise.resolve(2)).not.resolves.toBeDefined(); });',
      errors: [
        {
          column: 30,
          endColumn: 83,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // expect().rejects
    {
      code:
        'test("valid-expect", () => { expect(Promise.resolve(2)).rejects.toBeDefined(); });',
      errors: [
        {
          column: 30,
          endColumn: 78,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // expect().not.rejects
    {
      code:
        'test("valid-expect", () => { expect(Promise.resolve(2)).not.rejects.toBeDefined(); });',
      errors: [
        {
          column: 30,
          endColumn: 82,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // usages in async function
    {
      code:
        'test("valid-expect", async () => { expect(Promise.resolve(2)).resolves.toBeDefined(); });',
      errors: [
        {
          column: 36,
          endColumn: 85,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    {
      code:
        'test("valid-expect", async () => { expect(Promise.resolve(2)).not.resolves.toBeDefined(); });',
      errors: [
        {
          column: 36,
          endColumn: 89,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // alwaysAwait:false, one not awaited
    {
      code: `test("valid-expect", async () => { 
          expect(Promise.resolve(2)).not.resolves.toBeDefined(); 
          expect(Promise.resolve(1)).rejects.toBeDefined(); 
        });`,
      errors: [
        {
          line: 2,
          column: 11,
          endColumn: 64,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
        {
          line: 3,
          column: 11,
          endColumn: 59,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // alwaysAwait: true, one returned
    {
      code: `test("valid-expect", async () => { 
          await expect(Promise.resolve(2)).not.resolves.toBeDefined(); 
          expect(Promise.resolve(1)).rejects.toBeDefined(); 
        });`,
      errors: [
        {
          line: 3,
          column: 11,
          endColumn: 59,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    /**
     * Multiple async assertions
     */
    // both not awaited
    {
      code: `test("valid-expect", async () => { 
          expect(Promise.resolve(2)).not.resolves.toBeDefined(); 
          return expect(Promise.resolve(1)).rejects.toBeDefined(); 
        });`,
      options: [{ alwaysAwait: true }],
      errors: [
        {
          line: 2,
          column: 11,
          endColumn: 64,
          messageId: 'asyncMustBeAwaited',
        },
        {
          line: 3,
          column: 18,
          endColumn: 66,
          messageId: 'asyncMustBeAwaited',
        },
      ],
    },
    // alwaysAwait:true, one not awaited, one returned
    {
      code: `test("valid-expect", async () => { 
          expect(Promise.resolve(2)).not.resolves.toBeDefined(); 
          return expect(Promise.resolve(1)).rejects.toBeDefined(); 
        });`,
      errors: [
        {
          line: 2,
          column: 11,
          endColumn: 64,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // one not awaited
    {
      code: `test("valid-expect", async () => { 
          await expect(Promise.resolve(2)).not.resolves.toBeDefined(); 
          return expect(Promise.resolve(1)).rejects.toBeDefined(); 
        });`,
      options: [{ alwaysAwait: true }],
      errors: [
        {
          line: 3,
          column: 18,
          endColumn: 66,
          messageId: 'asyncMustBeAwaited',
        },
      ],
    },

    /**
     * Promise.x(expect()) usages
     */
    {
      code: `test("valid-expect", () => { 
          Promise.resolve(expect(Promise.resolve(2)).not.resolves.toBeDefined()); 
        });`,
      errors: [
        {
          line: 2,
          column: 11,
          endColumn: 81,
          messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    {
      code: `test("valid-expect", () => { 
          Promise.reject(expect(Promise.resolve(2)).not.resolves.toBeDefined()); 
        });`,
      errors: [
        {
          line: 2,
          column: 11,
          endColumn: 80,
          messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    {
      code: `test("valid-expect", () => { 
          Promise.x(expect(Promise.resolve(2)).not.resolves.toBeDefined()); 
        });`,
      errors: [
        {
          line: 2,
          column: 11,
          endColumn: 75,
          messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // alwaysAwait option changes error message
    {
      code: `test("valid-expect", () => { 
          Promise.resolve(expect(Promise.resolve(2)).not.resolves.toBeDefined()); 
        });`,
      options: [{ alwaysAwait: true }],
      errors: [
        {
          line: 2,
          column: 11,
          endColumn: 81,
          messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
        },
      ],
    },
    // Promise method accepts arrays and returns 1 error
    {
      code: `test("valid-expect", () => { 
          Promise.all([
            expect(Promise.resolve(2)).not.resolves.toBeDefined(),
            expect(Promise.resolve(3)).not.resolves.toBeDefined(),
          ]); 
        });`,
      errors: [
        {
          line: 2,
          column: 11,
          endLine: 5,
          endColumn: 13,
          messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // Promise.any([expect1, expect2]) returns one error
    {
      code: `test("valid-expect", () => { 
          Promise.x([
            expect(Promise.resolve(2)).not.resolves.toBeDefined(),
            expect(Promise.resolve(3)).not.resolves.toBeDefined(),
          ]); 
        });`,
      errors: [
        {
          line: 2,
          column: 11,
          endLine: 5,
          endColumn: 13,
          messageId: 'promisesWithAsyncAssertionsMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    //
    {
      code: `test("valid-expect", () => { 
          const assertions = [
            expect(Promise.resolve(2)).not.resolves.toBeDefined(),
            expect(Promise.resolve(3)).not.resolves.toBeDefined(),
          ]
        });`,
      errors: [
        {
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 66,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
        {
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 66,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    // Code coverage for line 29
    {
      code: 'expect(Promise.resolve(2)).resolves.toBe;',
      errors: [
        {
          column: 37,
          endColumn: 41,
          messageId: 'matcherOnPropertyNotCalled',
          data: { propertyName: 'toBe' },
        },
      ],
    },
    {
      code: `test("valid-expect", () => { 
        return expect(functionReturningAPromise()).resolves.toEqual(1).then(() => {
          expect(Promise.resolve(2)).resolves.toBe(1);
        });
      });`,
      errors: [
        {
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 54,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
    {
      code: `test("valid-expect", () => { 
        return expect(functionReturningAPromise()).resolves.toEqual(1).then(async () => {
          await expect(Promise.resolve(2)).resolves.toBe(1);
          expect(Promise.resolve(4)).resolves.toBe(4);
        });
      });`,
      errors: [
        {
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 54,
          messageId: 'asyncMustBeAwaited',
          data: { orReturned: ' or returned' },
        },
      ],
    },
  ],
});
