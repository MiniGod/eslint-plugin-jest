import {
  createRule,
  getStringValue,
  hasExpressions,
  isDescribe,
  isStringNode,
  isTemplateLiteral,
  isTestCase,
} from './tsUtils';

interface DescribeContext {
  describeTitles: string[];
  testTitles: string[];
}

const newDescribeContext = (): DescribeContext => ({
  describeTitles: [],
  testTitles: [],
});

export default createRule({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow identical titles',
      recommended: 'error',
    },
    messages: {
      multipleTestTitle:
        'Test title is used multiple times in the same describe block.',
      multipleDescribeTitle:
        'Describe block title is used multiple times in the same describe block.',
    },
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],
  create(context) {
    const contexts = [newDescribeContext()];
    return {
      CallExpression(node) {
        const currentLayer = contexts[contexts.length - 1];
        if (isDescribe(node)) {
          contexts.push(newDescribeContext());
        }
        const [firstArgument] = node.arguments;
        if (
          !isStringNode(firstArgument) ||
          (isTemplateLiteral(firstArgument) && hasExpressions(firstArgument))
        ) {
          return;
        }
        const title = getStringValue(firstArgument);
        if (isTestCase(node)) {
          if (currentLayer.testTitles.includes(title)) {
            context.report({ messageId: 'multipleTestTitle', node });
          }
          currentLayer.testTitles.push(title);
        }

        if (!isDescribe(node)) {
          return;
        }
        if (currentLayer.describeTitles.includes(title)) {
          context.report({ messageId: 'multipleDescribeTitle', node });
        }
        currentLayer.describeTitles.push(title);
      },
      'CallExpression:exit'(node) {
        if (isDescribe(node)) {
          contexts.pop();
        }
      },
    };
  },
});
