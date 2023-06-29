/* eslint-disable @typescript-eslint/semi */

import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'teampilot-ai.refactor',
    async () => {
      const editor = vscode.window.activeTextEditor
      if (editor) {
        const document = editor.document
        const selection = editor.selection

        const text = document.getText(selection)

        // Get all diagnostics for the current file
        const diagnostics = vscode.languages.getDiagnostics(document.uri)

        // Filter diagnostics to only include those that are within the selected text
        const errors = diagnostics
          .filter(
            (diagnostic) =>
              diagnostic.range.start.isAfterOrEqual(selection.start) &&
              diagnostic.range.end.isBeforeOrEqual(selection.end)
          )
          .map((diagnostic) => `${diagnostic.message}`)

        vscode.window
          .showInputBox({ prompt: 'Enter your refactor message' })
          .then((value) => {
            const languageId = document.languageId
            const fileExtension = document.fileName.split('.').pop()
            const languageCode = fileExtension || languageId
            if (value !== undefined) {
              const prompt = [
                value,
                `\`\`\`${languageCode}\n${text}\n\`\`\``,
                errors.length ? `Errors:\n${errors.join('\n')}` : '',
              ]
                .filter(Boolean)
                .join('\n\n')

              let uri = vscode.Uri.parse('http://localhost:3000/start-chat')
              uri = uri.with({
                // query: `content=${encodeURIComponent(prompt)}`,
                fragment: prompt,
              })

              vscode.env.openExternal(uri)
            }
          })
      }
    }
  )

  context.subscriptions.push(disposable)
}
