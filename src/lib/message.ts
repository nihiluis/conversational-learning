const codeRegex = /`{3}([\s\S]*?)`{3}/g

type MessageComponentType = "terminal" | "text"

export interface MessageComponent {
  type: MessageComponentType
  text: string
}

export function getMessageComponents(messageText: string) {
  const matches = messageText.match(codeRegex) ?? []

  const texts: MessageComponent[] = []

  if (matches.length === 0) {
    texts.push({ type: "text", text: messageText })
    return texts
  }

  let indexedString = messageText

  for (let matchText of matches) {
    const trimmedText = matchText.substring(3, matchText.length - 3)
    const searchString = matchText

    const foundIdx = indexedString.indexOf(searchString)

    const precedingText = indexedString.substring(0, foundIdx)
    if (precedingText.length > 0) {
      texts.push({ type: "text", text: precedingText.trim() })
    }

    texts.push({ type: "terminal", text: trimmedText.trim() })

    const searchStringEndIdx = foundIdx + searchString.length

    indexedString = indexedString.substring(searchStringEndIdx)
  }

  const followingText = indexedString
  if (followingText.length > 0) {
    texts.push({ type: "text", text: followingText.trim() })
  }

  return texts
}
