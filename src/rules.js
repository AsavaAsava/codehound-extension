exports.securityRules = [
    {
      id: 'SQL_INJECTION_RISK',
      severity: 'error',
      detect: (path) => {
        if (path.isCallExpression()) {
          const callee = path.get('callee');
          
          // Check common database methods
          const dbMethods = ['query', 'execute', 'run'];
          const isDbCall = dbMethods.some(method => {
            return callee.isMemberExpression() && 
                   callee.get('property').isIdentifier({ name: method });
          });
  
          if (isDbCall) {
            const args = path.node.arguments;
            return args.some(arg => 
              arg.type === 'BinaryExpression' && 
              arg.operator === '+' || 
              arg.type === 'TemplateLiteral'
            );
          }
        }
        return false;
      },
      message: 'Potential SQL Injection vulnerability detected',
      suggestion: 'Use parameterized queries instead of string concatenation'
    },
    // Add other rules similarly
  ];