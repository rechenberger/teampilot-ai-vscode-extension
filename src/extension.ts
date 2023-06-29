/* eslint-disable @typescript-eslint/semi */

import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'teampilot-ai.refactor',
    () => {
      const editor = vscode.window.activeTextEditor
      if (editor) {
        const document = editor.document
        const selection = editor.selection

        const text = document.getText(selection)

        vscode.window
          .showInputBox({ prompt: 'Enter your refactor message' })
          .then((value) => {
            if (value !== undefined) {
              const prompt = `${value} \n\`\`\`ts\n${text}\n\`\`\``
              const encodedPrompt = encodeURIComponent(prompt)
              const url = `https://teampilot.ai/new?prompt=${encodedPrompt}`

              vscode.env.openExternal(vscode.Uri.parse(url))
            }
          })
      }
    }
  )

  context.subscriptions.push(disposable)
}
