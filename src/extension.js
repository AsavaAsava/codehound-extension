const vscode = require('vscode');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { securityRules } = require('./rules');

let diagnosticCollection;

class SecurityFixProvider {
    provideCodeActions(document, range, context) {
        const codeActions = [];
        
        for (const diagnostic of context.diagnostics) {
            const rule = securityRules.find(r => r.id === diagnostic.code);
            if (rule && rule.suggestion) {
                const action = new vscode.CodeAction(
                    rule.suggestion,
                    vscode.CodeActionKind.QuickFix
                );
                action.diagnostics = [diagnostic];
                action.isPreferred = true;
                codeActions.push(action);
            }
        }
        
        return codeActions;
    }
}

function analyzeVulnerabilities(document) {
    const text = document.getText();
    const diagnostics = [];

    try {
        const ast = parser.parse(text, {
            sourceType: 'module',
            plugins: ['jsx']
        });

        traverse(ast, {
            enter(path) {
                for (const rule of securityRules) {
                    if (rule.detect(path)) {
                        console.log(`Detected vulnerability: ${rule.message}`);
                        const loc = path.node.loc;

                        if (!loc) {
                            console.log('No location data for node:', path.node);
                            return;
                        }

                        const range = new vscode.Range(
                            new vscode.Position(loc.start.line - 1, loc.start.column),
                            new vscode.Position(loc.end.line - 1, loc.end.column)
                        );

                        const diagnostic = new vscode.Diagnostic(
                            range,
                            `${rule.message}\n\nSuggestion: ${rule.suggestion}`,
                            vscode.DiagnosticSeverity.Error
                        );
                        diagnostic.code = rule.id;
                        diagnostics.push(diagnostic);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error parsing JavaScript:', error);
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

function activate(context) {
    
    diagnosticCollection = vscode.languages.createDiagnosticCollection('security-detector');
    context.subscriptions.push(diagnosticCollection);

    let changeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'javascript') {
            analyzeVulnerabilities(event.document);
        }
    });

    context.subscriptions.push(changeListener);


    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('javascript', 
            new SecurityFixProvider(), {
                providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
            }
        )
    );

    // Initial analysis of open documents
    vscode.workspace.textDocuments.forEach(document => {
        if (document.languageId === 'javascript') {
            analyzeVulnerabilities(document);
        }
    });
}

exports.activate = activate;
