exports.securityRules = [
  {
      id: 'SQL_INJECTION_RISK',
      severity: 'error',
      detect: (path) => {
          if (path.isCallExpression()) {
              const callee = path.get('callee');
              
              
              const dbMethods = ['query', 'execute', 'run', 'prepare'];
              let detectedMethod = null; 
              
              const isDbCall = dbMethods.some(method => {
                  const isMatch = callee.isMemberExpression() && 
                                  callee.get('property').isIdentifier({ name: method });
                  if (isMatch) {
                      detectedMethod = method; 
                  }
                  return isMatch;
              });

              if (isDbCall) {
                  const args = path.node.arguments;
                  const isDangerous = args.some(arg => 
                      (arg.type === 'BinaryExpression' && arg.operator === '+') || 
                      arg.type === 'TemplateLiteral'
                  );

                  if (isDangerous) {
                      console.log(`Potential SQL Injection detected in ${detectedMethod} call.`);
                  }

                  return isDangerous;
              }
          }
          return false;
      },
      message: 'Potential SQL Injection vulnerability detected',
      suggestion: 'Use parameterized queries instead of string concatenation'
  },
  {
    id: 'XSS_INNERHTML_RISK',
    severity: 'error',
    detect: (path) => {
        if (path.isAssignmentExpression()) {
            const left = path.get('left');
            if (left.isMemberExpression() && left.get('property').isIdentifier({ name: 'innerHTML' })) {
                console.log('Potential XSS vulnerability detected with innerHTML.');
                return true;
            }
        }
        return false;
    },
    message: 'Potential XSS vulnerability detected by using innerHTML',
    suggestion: 'Avoid using innerHTML, use safer DOM manipulation methods like textContent or setAttribute.'
}
];
