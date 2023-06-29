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

        let text = document.getText(selection)

        // If no text is selected, get the whole document
        if (selection.isEmpty) {
          text = document.getText()
        }

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

              let uri = vscode.Uri.parse('https://teampilot.ai/start-chat')
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
